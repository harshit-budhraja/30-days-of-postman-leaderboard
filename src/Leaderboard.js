import React from "react";
import _ from 'lodash';
import { DataGrid } from '@material-ui/data-grid';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import axios from 'axios';
import './App.css';

/**
 * Default Refresh Interval of 5 minutes
 */
let REFRESH_INTERVAL = 60 * 5;

/**
 * Mock API Endpoint
 */
const baseUrl = 'https://88d3ce90-a071-4e4b-84bc-d4092d42c9e8.mock.pstmn.io/leaders';

export default class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: []
        };
    }

    fetchData = async () => {
        try {
            if (_.has(this.props, "preFetch")) {
                this.props.preFetch();
            }
            const response = await axios.get(baseUrl);
            let data = _.get(response.data, 'completions');
            data.forEach(row => {
                row['id'] = row.workspaceId;
            });
            if (data.length > 0) {
                this.setState({ rows: data });
            }
            if (_.has(this.props, "postFetch")) {
                this.props.postFetch();
            }
        } catch (error) {
            throw error;
        }
    };

    async componentDidMount() {
        await this.fetchData();

        if (_.has(this.props, "refreshInterval")) {
            REFRESH_INTERVAL = this.props.refreshInterval;
        }

        this.intervalId = setInterval(() => {
            this.fetchData();
        }, 1000 * REFRESH_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        const tableColumnWidth = 240;
        const gridClassName = this.props.noembed ? "App-datagrid" : "leaderboard-embed";
        return (
            <div className={gridClassName}>
                <DataGrid
                    columns={[
                        {
                            field: 'name',
                            headerName: 'Name',
                            description: 'Name of the user who has completed the challenge',
                            width: tableColumnWidth * 1.8,
                            sortable: false
                        },
                        {
                            field: 'status',
                            headerName: 'Status',
                            description: 'Status of the challenge',
                            width: tableColumnWidth / 3,
                            renderCell: (params) => {
                                return params.value === "approved" ?
                                    <VerifiedUserIcon className="verified-user-icon" /> : params.value;
                            },
                            sortable: false,
                            filterable: false,
                            disableColumnMenu: true
                        },
                        {
                            field: 'dateGranted',
                            headerName: 'Date of Grant',
                            description: 'Date on which the submission was approved',
                            width: tableColumnWidth,
                            sortable: false
                        }
                    ]}
                    rows={this.state.rows}
                />
            </div>
        );
    }
}