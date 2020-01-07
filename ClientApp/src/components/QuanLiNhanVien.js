import React, { Component, Fragment } from 'react'

import { Route } from "react-router-dom";
//begin search 
import { Typeahead } from 'react-bootstrap-typeahead';
//end search 
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import axios from 'axios'
import Pagination from "react-js-pagination";
//begin Validation
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import validator from 'validator'
//end Validation
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./QuanLiNhanVien.css";
//begin vi
import { registerLocale, setDefaultLocale } from "react-datepicker";
import vi from 'date-fns/locale/vi';
registerLocale('vi', vi)
//end vi

export default class QuanLiNhanVien extends Component {
    constructor(props) {
        super(props);
        this.keyCode = this.keyCode.bind(this);
        this.state = {
            listItemTable: [],
            listItemTableCopy: [],
            giaTriInputSearch: '',
            formActionState: 'FILTER',
            trangThaiForm: false,
            tieuDeForm: 'TITLE',
            rowThayDoi: {},
            isDisable: false,

            activePage: 1,
            itemsCountPerPage: 10,
            totalItemsCount: 1,
            pageRangeDisplayed: 1,
            offsetFrom: 1,
            offsetTo: 10,

            orderByColumn: '',
            orderByDirection: 'ASC',

            selectedRow: { selectedRid: 0, selectedIndex: -1 },
        }
    }

    componentDidMount() {
        this.nhiemVu1();
        this.nhiemVu2();
        this.nhiemVu3();

        this.getFilter()
        document.addEventListener("keydown", this.keyCode, false);
    }

    nhiemVu1 = () => {
        axios.get("/Home/NhiemVu1",
            {
                params: {
                 
                }
            }
        ).then(response => {
            console.log(response.data)
        })
    }
    nhiemVu2 = () => {
        axios.get("/Home/NhiemVu2",
            {
                params: {
                 
                }
            }
        ).then(response => {
            console.log(response.data)
        })
    }
    nhiemVu3 = () => {
        axios.get("/Home/NhiemVu3",
            {
                params: {
                 
                }
            }
        ).then(response => {
            console.log(response.data)
        })
    }




    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyCode, false);
    }

    keyCode(e) {
        if (e.keyCode === 38 || e.keyCode === 40) { // UP DOWN
            e.preventDefault();
            if (this.state.listItemTable.length > 0) {
                var selectIndex = 0;
                var selectRid = 0;
                var vm = this.state;

                if (e.keyCode == 38) {
                    if (vm.selectedRow.selectedIndex === undefined || vm.selectedRow.selectedIndex <= 0) {
                        selectIndex = vm.selectedRow.selectedIndex = 0;
                        this.setState({ selectIndex });
                    } else {
                        selectIndex = vm.selectedRow.selectedIndex -= 1;
                        this.setState({ selectIndex });
                    }
                    selectRid = vm.selectedRow.selectedRid = vm.listItemTable[vm.selectedRow.selectedIndex].id;
                    this.setState({ selectRid });
                } else if (e.keyCode == 40) {
                    selectIndex = vm.selectedRow.selectedIndex
                    selectIndex = vm.listItemTable.length - 1
                    if (!vm.selectedRow.selectedIndex === undefined || vm.selectedRow.selectedIndex >= vm.listItemTable.length - 1) {
                        this.setState({ selectIndex });
                    } else {
                        selectIndex = vm.selectedRow.selectedIndex += 1
                        this.setState({ selectIndex });
                    }

                    selectRid = vm.selectedRow.selectedRid = vm.listItemTable[vm.selectedRow.selectedIndex].id;
                    this.setState({ selectRid });
                }
            }
        } else if (e.keyCode == 112) { //F1 : Add
            e.preventDefault();
            this.xuLyButtonAdd();
        } else if (e.keyCode == 117) { // F6: Edit
            e.preventDefault();
            if (this.state.selectedRow.selectedIndex != -1) {
                this.xuLyButtonEdit(this.state.listItemTable[this.state.selectedRow.selectedRid]);
            } else {
                alert("Vui lòng chọn mẫu tin cần sửa");
            };
        } else if (e.keyCode == 119) { // F8: Delete
            e.preventDefault();
            if (this.state.selectedRow.selectedIndex != -1) {
                this.xuLyButtonDelete(this.state.selectedRow.selectedRid);
            } else {
                alert("Vui lòng chọn mẫu tin cần xóa");
                return;
            };
        } if (this.state.trangThaiForm === true) {
            if ((e.keyCode == 113 || e.keyCode == 17 && e.keyCode == 83)) { //F2 or Ctrl + S: Save
                e.preventDefault();
                this.xuLyButtonLuu();

            } else if (e.keyCode == 120) { // F9: Hủy
                e.preventDefault();
                this.xuLyButtonHuy();
            }
        }
    }

    chuyenMauRowDuocChon = (key) => {
        if (this.state.selectedRow.selectedIndex === key) { return "table-primary" }
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
                activePage: response.data.activePage,
                itemsCountPerPage: response.data.itemsCountPerPage,
                totalItemsCount: response.data.totalItemsCount,
                pageRangeDisplayed: response.data.pageRangeDisplayed,
                offsetFrom: response.data.offsetFrom,
                offsetTo: response.data.offsetTo,
                orderByColumn: response.data.orderByColumn,
                orderByDirection: response.data.orderByDirection,
            });
        })
    }

    sortData = (value) => {
        if (this.state.orderByColumn == "" || this.state.orderByColumn != value) {
            this.state.orderByColumn = value
            this.state.orderByDirection = "DESC";

        } else if (this.state.orderByColumn == value) {
            if (this.state.orderByDirection == "ASC") {
                this.state.orderByDirection = "DESC";
            } else {
                this.state.orderByDirection = "ASC";
            }
        }
        this.iconSort()
        this.getFilter()
    }

    iconSort = (i) => {
        if (this.state.orderByColumn == '' || this.state.orderByColumn == null) { }
        else {
            if (this.state.orderByColumn === i) {
                if (this.state.orderByDirection === "ASC") {
                    return (<FaAngleUp />)
                } else {
                    return (<FaAngleDown />)
                }
            }
        }
    }

    duyetDataTable = () => {
        return (this.state.listItemTable.map((value, key) => {
            return (
                <Route key={key} render={({ history }) => (
                    <tr className={this.chuyenMauRowDuocChon(key)} >
                        <td>
                            <div className="btn-group">
                                <div className="btn btn-warning"
                                    onClick={() => this.xuLyButtonEdit(value)}
                                ><FaRegEdit /></div>
                                <div className="btn btn-danger"
                                    onClick={(id) => this.xuLyButtonDelete(value.id)}
                                ><FaRegTrashAlt /></div>
                            </div>
                        </td>
                        <td onClick={() => { history.push('/information' + '-' + value.id) }}>{value.id}</td>
                        <td onClick={() => { history.push('/information' + '-' + value.id) }}>{value.firstName}</td>
                        <td onClick={() => { history.push('/information' + '-' + value.id) }}>{value.lastName}</td>
                        <td onClick={() => { history.push('/information' + '-' + value.id) }}>{moment(value.birthDay).format('DD/MM/YYYY')}</td>
                    </tr>
                )} />
            )
        })
        )
    }

    timKiem = (dl) => {
        //setState gọi hàm để khi set xong mới xử lý ,()=>{}
        var danhSach = [];
        this.state.listItemTableCopy = [...this.state.listItemTable];
        this.state.listItemTable = [];
        this.state.listItemTableCopy.forEach((item) => {
            if (item.lastName.indexOf(dl) != -1) { danhSach.push(item) }
        })
        this.setState({ listItemTable: danhSach });
        this.duyetDataTable();
    }

    xuLyButtonDelete = (id) => {
        var tempData = this.state.listItemTable.filter(item => item.id !== id);
        this.setState({ listItemTable: tempData });
    }

    thayDoiTrangThaiForm = () => {
        this.setState({
            trangThaiForm: !this.state.trangThaiForm
        });
    }

    thayDoiGiaTriInput_BirthDay = (date) => {
        let objectToSet = {};
        objectToSet = this.state.rowThayDoi;
        objectToSet['birthDay'] = date;

        this.setState(objectToSet);
    }

    //gán giá trị cũ thành giá trị mới Input
    thayDoiGiaTriInput = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        let objectToSet = {};
        objectToSet = this.state.rowThayDoi;
        objectToSet[name] = value;

        this.setState(objectToSet);
    }

    //thay doi gia tri datepicker
    handleChangeDateTimePicker = (e) => {
        var obj = this.state.rowThayDoi;
        obj.birthDay = e.target.value;
        this.setState({
            rowThayDoi: obj
        });
    };

    xuLyButtonAdd = () => {
        this.thayDoiTrangThaiForm();
        this.setState({
            formActionState: 'ADD',
            tieuDeForm: 'Thêm mới thông tin',
            isDisable: false,
        })
    }

    xuLyButtonEdit = (value) => {
        console.log(value);
        this.thayDoiTrangThaiForm();
        this.setState({
            formActionState: 'EDIT',
            tieuDeForm: 'Chỉnh sửa thông tin',
            isDisable: true,

        })
        this.hienThiDuLieuLenInputKhiEdit(value);
    }

    //hiển thị dữ liệu lên trên input
    hienThiDuLieuLenInputKhiEdit = (item) => {
        var obj = {};
        obj.id = item.id;
        obj.firstName = item.firstName;
        obj.lastName = item.lastName;
        obj.birthDay = moment(item.birthDay, 'MM/DD/YYYY').toDate();
        this.setState({
            rowThayDoi: obj
        });

    }

    xuLyButtonLuu = () => {
        var itemThayDoi = {};
        itemThayDoi.id = this.state.rowThayDoi.id;
        itemThayDoi.firstName = this.state.rowThayDoi.firstName;
        itemThayDoi.lastName = this.state.rowThayDoi.lastName;
        var date = moment(this.state.rowThayDoi.birthDay).format('MM/DD/YYYY');
        itemThayDoi.birthDay = date;


        axios.get("/Home/GetDayFormClient",
            {
                params: {
                    id: itemThayDoi.id,
                    birthDay: itemThayDoi.birthDay
                }

            }
        ).then(response => {
            itemThayDoi = response.data
        })
        if (this.state.formActionState === 'EDIT') {
            this.updateDuLieuSauKhiEdit(itemThayDoi);
        } else if (this.state.formActionState === 'ADD') {
            this.updateDuLieuSauKhiAdd(itemThayDoi);
        }
        this.thayDoiTrangThaiForm();
        this.setState({
            formActionState: 'FILTER',
            rowThayDoi: {},
        })
    }

    updateDuLieuSauKhiAdd = (item) => {
        this.state.listItemTable.push(item)
    }

    updateDuLieuSauKhiEdit = (item) => {
        this.state.listItemTable.forEach((value, key) => {
            if (value.id === item.id) {
                value.id = item.id
                value.firstName = item.firstName
                value.lastName = item.lastName
                value.birthDay = item.birthDay
            }
        })
        console.log(this.state.listItemTable);
    }

    xuLyButtonHuy = () => {
        this.thayDoiTrangThaiForm();
        this.setState({
            formActionState: 'FILTER',
            rowThayDoi: {},
        })
    }

    anHienFormVaTable = () => {
        if (this.state.trangThaiForm === false) {
            return (
                <div className="overflow-auto col">
                    <table className="table table-striped table-inverse table-hover">
                        <thead className="thead-inverse">
                            <tr>
                                <th>
                                    <div className="btn btn-primary"
                                        onClick={() => this.xuLyButtonAdd()}
                                    >Thêm mới</div>
                                </th>
                                <th>
                                    <i onClick={(value) => this.sortData("id")}>ID</i>
                                    <i>{this.iconSort("id")}</i>
                                </th>
                                <th>
                                    <i onClick={(value) => this.sortData("ho")}>Họ</i>
                                    <i>{this.iconSort("ho")}</i>
                                </th>
                                <th>Tên</th>
                                <th>Ngày sinh </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.duyetDataTable()}
                        </tbody>
                    </table>
                    <div className="row mt-3">
                        <div className="col-4">
                            Hiển thị từ {this.state.offsetFrom} đến {this.state.offsetTo} / {this.state.totalItemsCount}
                        </div>
                        <div className="d-flex align-items-center col-5">
                            <Pagination
                                itemClass="page-item"
                                linkClass="page-link"
                                activePage={this.state.activePage}
                                //mục trên mỗi trang
                                itemsCountPerPage={this.state.itemsCountPerPage}
                                //tổng số mục 
                                totalItemsCount={this.state.totalItemsCount}
                                //hiển thị 3 ô
                                pageRangeDisplayed={this.state.pageRangeDisplayed}
                                onChange={this.thayDoiActionPage}
                            />
                        </div>

                        <div className="col-3">
                            <label htmlFor="pagesize">Số dòng/ trang:</label>
                            <select id="pagesize" onChange={this.soDongTrenMotTrang}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                    </div>
                </div >
            )
        } else {
            return (
                <div className="card text-black border border-dark mb-3 mt-3">
                    <div className="card-header text-center">{this.state.tieuDeForm}</div>
                    <div className="card-body text-primary">
                        <ValidationForm onSubmit={this.submitSuccessful} onErrorSubmit={this.submitFail}>
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <TextInput name="id" id="id" required
                                    autoFocus
                                    type="number"
                                    errorMessage={{ required: "Vui lòng điền số" }}
                                    value={this.state.rowThayDoi.id || ''}
                                    onChange={(event) => this.thayDoiGiaTriInput(event)}
                                    disabled={this.state.isDisable}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="firstName">First name</label>
                                <TextInput name="firstName" id="firstName" required
                                    errorMessage={{ required: "Vui lòng điền họ" }}
                                    value={this.state.rowThayDoi.firstName || ''}
                                    onChange={(event) => this.thayDoiGiaTriInput(event)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Last name</label>
                                <TextInput name="lastName" id="lastName" required
                                    errorMessage={{ required: "Vui lòng điền tên" }}
                                    value={this.state.rowThayDoi.lastName || ''}
                                    onChange={(event) => this.thayDoiGiaTriInput(event)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="birthDay">Birthday</label>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    todayButton="Hôm nay"
                                    locale="vi"
                                    name="birthDay"
                                    placeholderText="Ngày sinh"
                                    selected={this.state.rowThayDoi.birthDay || ''}
                                    onChange={(date) => this.thayDoiGiaTriInput_BirthDay(date, "birthDay")}
                                />
                            </div>

                            <div className="form-group">
                                <button className="btn btn-block btn-outline-primary">Lưu</button>
                                <input type="button"
                                    onClick={() => this.xuLyButtonHuy()}
                                    className="btn btn-block btn-outline-danger"
                                    value="Hủy">
                                </input>
                            </div>

                        </ValidationForm>


                    </div>
                </div>
            )
        }
    }

    //thay đổi số item trên 1 trang
    soDongTrenMotTrang = (event) => {
        this.setState({ itemsCountPerPage: event.target.value }
            , () => { this.getFilter(this.state.itemsCountPerPage) }
        );
    }

    // thay đổi activePage
    thayDoiActionPage = (pageNumber) => {
        this.setState({ activePage: pageNumber }
            , () => { this.getFilter(this.state.activePage) }
        );
    }

    //Validation ko lỗi thì submitSuccessful() còn lỗi submitFail()
    submitSuccessful = (e, formData, inputs) => {
        e.preventDefault();
        this.xuLyButtonLuu();
    }
    submitFail = (e, formData, errorInputs) => {
        console.error(errorInputs)
    }

    thayDoiInputSearch = (selectedOptions) => {
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            let lastName = selectedOptions[0].lastName;
            this.timKiem(lastName);
        } else {
            this.getFilter();
        }
    }

    render() {
        return (
            <div>
                <Fragment>
                    <Typeahead
                        options={this.state.listItemTable}
                        labelKey="lastName"
                        id="id"
                        placeholder="Filter by state name or capital..."
                        renderMenuItemChildren={(option) => (
                            <div>
                                {option.id}
                                <div>
                                    <small>Capital: {option.lastName}</small>
                                </div>
                            </div>
                        )}
                        onChange={this.thayDoiInputSearch}
                    />
                </Fragment>
                {this.anHienFormVaTable()}
                <div>
                </div>
            </div>
        )
    }
}