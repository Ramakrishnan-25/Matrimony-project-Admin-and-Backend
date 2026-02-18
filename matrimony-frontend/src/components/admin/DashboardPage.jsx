import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

import profImages from "/assets/images/profiles/1.jpg";
import NewLayout from "./layout/NewLayout";

Chart.register(...registerables);

const DashboardPage = () => {
  const chartsRef = useRef({
    earningChart: null,
    usersChart: null,
    monthlyEarningsChart: null,
  });

  useEffect(() => {
    Chart.defaults.font.size = 14;
    Chart.defaults.color = "#666";

    const initCharts = () => {
      if (chartsRef.current.earningChart) {
        chartsRef.current.earningChart.destroy();
      }
      if (chartsRef.current.usersChart) {
        chartsRef.current.usersChart.destroy();
      }
      if (chartsRef.current.monthlyEarningsChart) {
        chartsRef.current.monthlyEarningsChart.destroy();
      }

      // Earnings Pie Chart
      const earningCanvas = document.getElementById("Chart_earni");
      if (earningCanvas) {
        chartsRef.current.earningChart = new Chart(earningCanvas, {
          type: "pie",
          data: {
            labels: ["Premium Plus", "Premium"],
            datasets: [
              {
                data: [50, 60],
                backgroundColor: ["#8463FF", "#6384FF"],
              },
            ],
          },
        });
      }

      // Users Pie Chart
      const usersCanvas = document.getElementById("Chart_users");
      if (usersCanvas) {
        chartsRef.current.usersChart = new Chart(usersCanvas, {
          type: "pie",
          data: {
            labels: ["Premium Plus", "Premium", "Free"],
            datasets: [
              {
                data: [40, 30, 30],
                backgroundColor: ["#198754", "#ffc107", "#6c757d"],
              },
            ],
          },
        });
      }

      // Monthly Earnings Bar Chart
      const earningsReceiptCanvas = document.getElementById("Chart_earni_rece");
      if (earningsReceiptCanvas) {
        chartsRef.current.monthlyEarningsChart = new Chart(
          earningsReceiptCanvas,
          {
            type: "bar",
            data: {
              labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              datasets: [
                {
                  label: "Monthly Earnings",
                  data: [
                    4000, 5000, 4550, 6005, 8550, 9008, 3220, 4880, 6550, 2500,
                    4000, 5000,
                  ],
                  backgroundColor: "rgba(255,99,132,0.2)",
                  borderColor: "rgba(255,99,132,1)",
                  borderWidth: 2,
                  hoverBackgroundColor: "rgba(255,99,132,0.4)",
                  hoverBorderColor: "rgba(255,99,132,1)",
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );
      }
    };

    initCharts();

    // Update copyright year
    const copyrightYear = document.getElementById("cry");
    if (copyrightYear) {
      copyrightYear.textContent = new Date().getFullYear();
    }

    // Initialize menu script if available
    if (window.reinitializeMenu) {
      window.reinitializeMenu();
    }

    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== "undefined") {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }

    // Cleanup function
    return () => {
      // Destroy all charts when component unmounts
      if (chartsRef.current.earningChart) {
        chartsRef.current.earningChart.destroy();
      }
      if (chartsRef.current.usersChart) {
        chartsRef.current.usersChart.destroy();
      }
      if (chartsRef.current.monthlyEarningsChart) {
        chartsRef.current.monthlyEarningsChart.destroy();
      }
    };
  }, []);
  return (
    <NewLayout>
      <div className="pan-rhs">
        <div className="row main-head">
          <div className="col-md-4">
            <div className="tit">
              <h1>Admin Dashboard</h1>
            </div>
          </div>
          <div className="col-md-8">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#">Library</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Data
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="box-com box-qui box-drk grn-box">
              <h4>New Users</h4>
              <h2>User requests</h2>
              <span className="bnum">69</span>
              <p>This count for today how many users can register.</p>
              <a href="admin-new-user-requests.html" className="fclick"></a>
            </div>
            <div className="box-com box-qui box-lig ali-cen">
              <h3>
                <span>All</span> Members
              </h3>
              <span className="bnum">6900</span>
              <canvas id="Chart_users"></canvas>
              <a href="admin-new-user-requests.php" className="fclick"></a>
            </div>
            <div className="box-com box-qui live-box">
              <h4>Live visitos</h4>
              <h2>Currently Active Users</h2>
              <span className="bnum">3600</span>
              <p>
                Currently <span>3600</span> visitos survey in your website{" "}
              </p>
              <div className="live">
                <span className="move"></span>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="box-com box-qui box-lig box-new-user">
              <h2>New Registrants</h2>
              <span className="bnum">38</span>
              <div className="users-cir-thum-hori">
                <span>
                  <img
                    src={profImages}
                    data-bs-toggle="tooltip"
                    title="Hooray!"
                  />
                </span>
                <span>
                  <img
                    src={profImages}
                    data-bs-toggle="tooltip"
                    title="Hooray!"
                  />
                </span>
                <span>
                  <img
                    src={profImages}
                    data-bs-toggle="tooltip"
                    title="Hooray!"
                  />
                </span>
                <span>
                  <img
                    src={profImages}
                    data-bs-toggle="tooltip"
                    title="Hooray!"
                  />
                </span>
                <span>
                  <img
                    src={profImages}
                    data-bs-toggle="tooltip"
                    title="Hooray!"
                  />
                </span>
                <span>
                  <img
                    src={profImages}
                    data-bs-toggle="tooltip"
                    title="Hooray!"
                  />
                </span>
                <span>
                  <img
                    src={profImages}
                    data-bs-toggle="tooltip"
                    title="Hooray!"
                  />
                </span>
                <span>
                  <img
                    src={profImages}
                    data-bs-toggle="tooltip"
                    title="Hooray!"
                  />
                </span>
              </div>
            </div>
            <div className="box-com box-qui box-lig ali-cen">
              <h3>
                <span>Total</span> Earnings
              </h3>
              <span className="bnum">
                <sub>$</sub>10,069{" "}
              </span>
              <canvas id="Chart_earni"></canvas>
            </div>
            <div className="box-com box-qui box-drk box-lead-thum">
              <h2>Leads & Enquiry</h2>
              <span className="bnum">28</span>
              <div className="lead-cir-thum-hori">
                <span data-bs-toggle="tooltip" title="Anna">
                  A
                </span>
                <span data-bs-toggle="tooltip" title="John">
                  j
                </span>
                <span data-bs-toggle="tooltip" title="Bailey">
                  b
                </span>
                <span data-bs-toggle="tooltip" title="Erick">
                  e
                </span>
                <span data-bs-toggle="tooltip" title="Boby">
                  b
                </span>
                <span data-bs-toggle="tooltip" title="Uma">
                  u
                </span>
                <span data-bs-toggle="tooltip" title="Maria">
                  m
                </span>
              </div>
              <a href="admin-enquiry.html" className="fclick"></a>
            </div>
          </div>
          <div className="col-md-6">
            <div className="box-com box-qui box-lig ali-cen">
              <h3>
                <span>Monthly</span> Earnings
              </h3>
              <span className="bnum">
                <sub>$</sub>10,069{" "}
              </span>
              <canvas id="Chart_earni_rece"></canvas>
            </div>
            <div className="box-com box-qui box-drk box-them-info">
              <h4>Template update status</h4>
              <ul>
                <li>
                  Current version you installed: <strong>3.6</strong>
                </li>
                <li>
                  Latest version: <strong>4.2</strong>
                </li>
                <li>
                  Template Activation: <strong>Yes</strong>
                </li>
              </ul>
              <a href="#" className="btn-com btn-red">
                Update
              </a>
              <a href="#" className="btn-com btn-gre">
                Licance key
              </a>
              <a href="#" className="btn-com btn-line btn-whi">
                More details
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="box-com box-qui box-lig box-tab">
              <div className="tit">
                <h3>Recent members</h3>
                <p>Recently joined members</p>
                <div className="dropdown">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        View all profile
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Profile</th>
                    <th>Phone</th>
                    <th>Join date</th>
                    <th>Plan type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Ashley emyy</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>22, Feb 2024</td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Elizabeth Taylor</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>22, Feb 2024</td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Angelina Jolie</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>22, Feb 2024</td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Olivia mia</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>22, Feb 2024</td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Jennifer</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>22, Feb 2024</td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Emmy jack</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>22, Feb 2024</td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-6">
            <div className="box-com box-qui box-lig box-tab">
              <div className="tit">
                <h3>Renewal Reminder</h3>
                <p>Below listed profils going to expairy soon.</p>
                <div className="dropdown">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        View all profile
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Profile</th>
                    <th>Phone</th>
                    <th>Expairy date</th>
                    <th>Plan type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Ashley emyy</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>
                      <span className="hig-red">22, Feb 2024</span>
                    </td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Elizabeth Taylor</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>
                      <span className="hig-red">22, Feb 2024</span>
                    </td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Angelina Jolie</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>
                      <span className="hig-red">22, Feb 2024</span>
                    </td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Olivia mia</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>
                      <span className="hig-red">22, Feb 2024</span>
                    </td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Jennifer</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>
                      <span className="hig-red">22, Feb 2024</span>
                    </td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>
                      <div className="prof-table-thum">
                        <div className="pro">
                          <img src={profImages} alt="" />
                        </div>
                        <div className="pro-info">
                          <h5>Emmy jack</h5>
                          <p>ashleyipsum@gmail.com</p>
                        </div>
                      </div>
                    </td>
                    <td>01 321-998-91</td>
                    <td>
                      <span className="hig-red">22, Feb 2024</span>
                    </td>
                    <td>
                      <span className="hig-grn">Premium</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="dropdown"
                        >
                          <i
                            className="fa fa-ellipsis-h"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              More details
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              View profile
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </NewLayout>
  );
};

export default DashboardPage;
