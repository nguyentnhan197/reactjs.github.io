import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment';

export default class QuanLiNV_Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listItemTable: [],

            activePage: 1,
            itemsCountPerPage: 10,
            totalItemsCount: 1,
            pageRangeDisplayed: 1,
            offsetFrom: 1,
            offsetTo: 10,

            orderByColumn: '',
            orderByDirection: 'ASC',
        }
    }
    componentDidMount() {
        this.getFilter()
    }
    getFilter = () => {
        axios.get("/Home/GetDanhSachCustomer",
            {
                params: {
                    activePage: this.state.activePage,
                    itemsCountPerPage: this.state.itemsCountPerPage,
                    orderByColumn: this.state.orderByColumn,
                    orderByDirection: this.state.orderByDirection,
                }
            }
        ).then(response => {
            this.setState({
                listItemTable: response.data.danhSach,
            });
        })
    }
    render() {
        return (
            <div>
                {this.state.listItemTable.map((value, key) => {
                        if (value.id == this.props.match.params.id) {
                            return (
                                <div className="jumbotron jumbotron-fluid" key={key}>
                                    <div className="container text-center">
                                        <h1 className="display-3">{value.id}</h1>
                                        <p className="lead">{value.firstName}</p>
                                        <p className="lead">{value.lastName}</p>
                                        <p className="lead">{moment(value.birthDay).format('DD/MM/YYYY')}</p>
                                        <hr className="my-2" />
                                    </div>
                                </div>
                            )
                        }
                    })
                }
            </div>
        )
    }
}
