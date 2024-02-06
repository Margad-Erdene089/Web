import {
  ClipboardListIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import LoadingDialog from "../loadingSpinner";
import Chart from "chart.js";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import XDate from "xdate";
import ProgressBar from "@ramonak/react-progress-bar";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = Cookies.get("token");
  const [milestones, setMilestones] = useState([
    {
      epicName: "Шинэ хөгжүүлэлт",
      epicGoal: "workflow хэсгийг хөгжүүлэх",
      allTask: 1,
      doneTask: 1,
      milestone: "2024-02-01",
      timeSpent: 100,
      estimated: 100,
    },
  ]);
  const [others, setOthers] = useState([
    {
      Id: 2,
      categoryName: "Дэмжлэг",
      allUserStory: 50,
      waitingUserStory: 30,
      timeSpent: 20,
    },
    {
      Id: 3,
      categoryName: "Хөгжүүлэлт",
      allUserStory: 40,
      waitingUserStory: 20,
      timeSpent: 20,
    },
    {
      Id: 4,
      categoryName: "Бусад",
      allUserStory: 10,
      waitingUserStory: 5,
      timeSpent: 20,
    },
  ]);

  async function getMilestones() {
    await axios
      .get(`${global.apiURL}/agileDashboard`, {
        headers: {
          "access-token": token,
          component: "milestone",
        },
      })
      .then((response) => {
        setMilestones(response.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          router.push("/login");
        }
      });
  }

  async function getOther() {
    await axios
      .get(`${global.apiURL}/agileDashboard`, {
        headers: {
          "access-token": token,
          component: "other",
        },
      })
      .then((response) => {
        setOthers(response.data);

        var configDoughnut = {
          type: "doughnut",
          data: {
            labels: response.data && response.data.map((e) => e.categoryName),
            datasets: [
              {
                label: "Гүйцэтгэсэн ажил",
                backgroundColor: [
                  "rgb(133, 105, 241)",
                  "rgb(164, 101, 241)",
                  "rgb(101, 143, 241)",
                ],
                data:
                  response.data && response.data.map((e) => e.timeSpent / 60),
                hoverOffset: 4,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            aspectRatio: 1,
            responsive: true,
            elements: {
              arc: {
                weight: 0.5,
                borderWidth: 3,
              },
            },
            cutout: 150,
            legend: {
              position: "bottom",
              display: true,
              labels: {
                usePointStyle: true,
                boxWidth: 9,
              },
            },
            title: {
              display: false,
              text: "Chart",
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  var dataLabel = data.labels[tooltipItem.index];
                  var value =
                    ": " +
                    data.datasets[tooltipItem.datasetIndex].data[
                      tooltipItem.index
                    ].toLocaleString() +
                    " цаг";

                  if (Chart.helpers.isArray(dataLabel)) {
                    dataLabel = dataLabel.slice();
                    dataLabel[0] += value;
                  } else {
                    dataLabel += value;
                  }
                  return dataLabel;
                },
              },
            },
            hover: {
              mode: "nearest",
              intersect: true,
            },
            scales: {
              xAxes: [
                {
                  display: false,
                },
              ],
              yAxes: [
                {
                  display: false,
                },
              ],
            },
          },
        };
        var ctxDoughnut = document
          .getElementById("doughnut-chart")
          .getContext("2d");
        window.myLine = new Chart(ctxDoughnut, configDoughnut);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          router.push("/login");
        }
        console.log(err);
      });
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([getMilestones(), getOther()]).then(() => {
      setLoading(false);
    });

    var configDoughnut = {
      type: "doughnut",
      data: {
        labels: others && others.map((e) => e.categoryName),
        datasets: [
          {
            label: "Гүйцэтгэсэн ажил",
            backgroundColor: [
              "rgb(133, 105, 241)",
              "rgb(164, 101, 241)",
              "rgb(101, 143, 241)",
            ],
            data: others && others.map((e) => e.timeSpent / 60),
            hoverOffset: 4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        aspectRatio: 1,
        responsive: true,
        elements: {
          arc: {
            weight: 0.5,
            borderWidth: 3,
          },
        },
        cutout: 150,
        legend: {
          position: "bottom",
          display: true,
          labels: {
            usePointStyle: true,
            boxWidth: 9,
          },
        },
        title: {
          display: false,
          text: "Chart",
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var dataLabel = data.labels[tooltipItem.index];
              var value =
                ": " +
                data.datasets[tooltipItem.datasetIndex].data[
                  tooltipItem.index
                ].toLocaleString() +
                " цаг";
              if (Chart.helpers.isArray(dataLabel)) {
                dataLabel = dataLabel.slice();
                dataLabel[0] += value;
              } else {
                dataLabel += value;
              }
              return dataLabel;
            },
          },
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
      },
    };
    var ctxDoughnut = document
      .getElementById("doughnut-chart")
      .getContext("2d");
    window.myLine = new Chart(ctxDoughnut, configDoughnut);

    // // Charts
    var configLine = {
      type: "bar",
      data: {
        labels: ["1-20", "1-21", "1-22", "1-23", "1-24", "1-25", "1-26"],
        datasets: [
          {
            label: "Ажилласан цаг",
            backgroundColor: "rgb(79, 70, 229, 1)",
            data: [6, 5, 6, 4, 6, 4, 7],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: false,
          text: "Chart",
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "rgba(0,0,0)",
                padding: 10,
              },
              display: true,
              scaleLabel: {
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(0,0,0)",
                beginAtZero: true,
              },
              min: 0,
              display: true,
              scaleLabel: {
                display: false,
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                color: "rgb(238 242 255)",
              },
            },
          ],
        },
      },
    };
    var ctxLine = document.getElementById("line-chart").getContext("2d");
    window.myLine = new Chart(ctxLine, configLine);
  }, []);

  function progressBar(estimated, spent) {
    let percent = Math.round((100 / estimated) * spent);
    return percent > 7 ? `w-[${percent}%]` : "w-[7%]";
  }

  function otherIcon(id) {
    if (id == 2) {
      return (
        <ClipboardListIcon
          className="h-7 w-7 text-indigo-600"
          aria-hidden="true"
        />
      );
    } else if (id == 3) {
      return (
        <UsersIcon className="h-7 w-7 text-indigo-600" aria-hidden="true" />
      );
    }

    return (
      <QuestionMarkCircleIcon
        className="h-7 w-7 text-indigo-600"
        aria-hidden="true"
      />
    );
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <main>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2 lg:col-start-1">
            {/* Description list*/}
            <section aria-labelledby="applicant-information-title">
              <div className="flex flex-col gap-y-3">
                {milestones ? (
                  milestones.map((item, index) => (
                    <div key={index} className="bg-white shadow sm:rounded-lg">
                      <div className="flex flex-row justify-between items-start">
                        <div className="px-4 py-5 sm:px-6 w-1/2">
                          <h2
                            id="applicant-information-title"
                            className="text-lg font-semibold leading-6 text-gray-900"
                          >
                            {item.epicName}
                          </h2>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {item.epicGoal}
                          </p>
                        </div>
                        <div className="px-4 py-5 sm:px-6 w-1/2">
                          <p className="text-sm font-medium text-gray-500 text-right">
                            Биелэлт
                          </p>
                          <ProgressBar
                            completed={
                              item.allTask != 0
                                ? Math.round(
                                    (100 / item.allTask) * item.doneTask
                                  )
                                : 10
                            }
                            bgColor="#4F46E5"
                            baseBgColor="#E0E7FF"
                            height="15px"
                            customLabel={
                              item.allTask != 0
                                ? Math.round(
                                    (100 / item.allTask) * item.doneTask
                                  ) + "%"
                                : "0%"
                            }
                            labelClassName="text-xs font-medium text-indigo-100 text-center w-full"
                          />
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-3 gap-3">
                          <div className="col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Дуусах хугацаа
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new XDate(item.milestone).toString("yyyy-MM-dd")}
                            </dd>
                          </div>
                          <div className="col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Онооны гүйцэтгэл
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <div className="flex flex-row">
                                {item.timeSpent + " /"}
                                <p className="ml-1 text-sm font-bold text-indigo-600">
                                  {item.estimated}
                                </p>
                              </div>
                            </dd>
                          </div>
                          <div className="col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Хийх ажил
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <div className="flex flex-row">
                                {item.doneTask + " /"}
                                <p className="ml-1 text-sm font-bold text-indigo-600">
                                  {item.allTask}
                                </p>
                              </div>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>

              <div className="mt-4 bg-white shadow sm:rounded-lg">
                <div className="py-4 px-6 h-auto">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Өдөрт зарцуулж буй цаг
                  </h2>
                  <canvas id="line-chart"></canvas>
                </div>
              </div>
            </section>
          </div>

          <section
            aria-labelledby="timeline-title"
            className="lg:col-span-1 lg:col-start-3"
          >
            <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
              <h2
                id="timeline-title"
                className="text-lg font-semibold text-gray-900"
              >
                Энэ сард гүйцэтгэсэн
              </h2>

              {/* Activity Feed */}
              <div className="mt-2 flow-root">
                <div>
                  <dl className="grid grid-cols-1 gap-4">
                    {others &&
                      others.map((item) => (
                        <>
                          {item.Id != 1 && ( // removing төлөвлөгөөт ажил
                            <div
                              key={item.categoryName}
                              className="px-4 py-5 sm:p-6 shadow rounded-lg"
                            >
                              <div className="flex flex-row items-center justify-between">
                                <div>
                                  <dt className="text-base font-normal text-gray-900">
                                    {item.categoryName}
                                  </dt>
                                  <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                                    <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                                      {item.allUserStory -
                                        item.waitingUserStory}
                                      <span className="ml-2 text-sm font-medium text-gray-500">
                                        хүлээгдэж буй {item.waitingUserStory}
                                      </span>
                                    </div>
                                  </dd>
                                </div>
                                {otherIcon(item.Id)}
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                  </dl>
                </div>
              </div>
              {others && (
                <div>
                  <h2
                    id="timeline-title"
                    className="mt-4 text-lg font-semibold text-gray-900"
                  >
                    Ажлын цагууд
                  </h2>
                  <div className="mt-2 px-4 py-5 sm:p-6 shadow rounded-lg">
                    <canvas id="doughnut-chart"></canvas>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      {loading && <LoadingDialog loading={loading} />}
    </>
  );
}
