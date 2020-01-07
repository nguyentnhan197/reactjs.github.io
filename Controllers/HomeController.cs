using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace DemoReact.Controllers
{
    public class HomeController : Controller
    {
       
        public IActionResult Index()
        {
            return View();
        }

        public JsonResult GetDanhSachCustomer(ClientFilter filter = null)
        {

            var list = new List<Customer>();
            var batDau = 0;
            var ketThuc = 0;
            DateTime now = new DateTime(2019, 12, 28);
            if (filter.orderByDirection == "ASC")
            {
                batDau = filter.activePage * filter.itemsCountPerPage - (filter.itemsCountPerPage - 1);
                ketThuc = filter.activePage * filter.itemsCountPerPage;
                for (int i = batDau; i <= ketThuc; i++)
                {
                    var cus = new Customer();
                    cus.id = i;
                    cus.firstName = "First Name " + (i);
                    cus.lastName = "Last Name " + (i);
                    cus.birthDay = string.Format("{0:MM/dd/yyyy}", now);
                    //cus.birthDay = string.Format("{0:s}", now);
                    //new DateTime(2019, 12, 28);
                    //String.Format("{0:dd/MM/yyyy}", cus.birthDay);
                    //String.Format("{0:d}", cus.birthDay);

                    list.Add(cus);
                }
            }
            else
            {
                ketThuc = filter.activePage * filter.itemsCountPerPage - (filter.itemsCountPerPage - 1);
                batDau = filter.activePage * filter.itemsCountPerPage;
                for (int i = batDau; i >= ketThuc; i--)
                {
                    var cus = new Customer();
                    cus.id = i;
                    cus.firstName = "First Name " + (i);
                    cus.lastName = "Last Name " + (i);
                    cus.birthDay = string.Format("{0:MM/dd/yyyy}", now);
                    list.Add(cus);
                }
            }




            var result = new XPagination<Customer>();
            result.danhSach = list;
            result.activePage = filter.activePage;
            result.itemsCountPerPage = filter.itemsCountPerPage;
            result.totalItemsCount = 100;
            result.pageRangeDisplayed = 5;
            result.offsetFrom = batDau;
            result.offsetTo = ketThuc;
            result.orderByColumn = filter.orderByColumn;
            result.orderByDirection = filter.orderByDirection;

            return Json(result);

        }
        public JsonResult GetDayFormClient(int i = 0, string birthDay = "")
        {
            var result = new Customer();
            result.id = i;
            result.firstName = "First Name " + (i);
            result.lastName = "Last Name " + (i);
            result.birthDay = birthDay;
            return Json(result);
        }
        public class Customer
        {
            public int id { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string birthDay { get; set; }

        }
        public class XPagination<T>
        {
            public List<T> danhSach { get; set; }
            //trang hien tai
            public int activePage { get; set; }
            //số dòng trên mỗi trang
            public int itemsCountPerPage { get; set; }
            //tổng 
            public int totalItemsCount { get; set; }
            //hiển thị ô
            public int pageRangeDisplayed { get; set; }
            public int offsetFrom { get; set; }
            public int offsetTo { get; set; }
            public string orderByColumn { get; set; }
            public string orderByDirection { get; set; }


        }
        public class ClientFilter
        {
            public int activePage { get; set; }
            public int itemsCountPerPage { get; set; }
            public string orderByColumn { get; set; }
            public string orderByDirection { get; set; }

        }

    }

}
