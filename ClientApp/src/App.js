import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import QuanLiNhanVien from './components/QuanLiNhanVien';
import QuanLiNV_Information from './components/QuanLiNV_Information';
import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route exact path='/home' component={Home} />
                <Route path='/information-:id' component={QuanLiNV_Information} />
                <Route path='/counter' component={Counter} />
                <Route path='/fetch-data' component={FetchData} />
                <Route path='/quan-li-nhan-vien' component={QuanLiNhanVien} />
            </Layout>
        );
    }
}
