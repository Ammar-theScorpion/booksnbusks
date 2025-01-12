import StudentLayout from "../../layouts/student";
import { useFetch } from "../../helpers/hooks";
import { fetchAttendance, fetchClasses } from "../../helpers/backend_helper";
import { useEffect, useState } from "react";
import moment from "moment";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { Table } from "react-bootstrap";
// /Users/yazanawad/code/schoolBucks/website/BooksNBucksWebsite/components/common/alert.js

const Attendance = () => {
  const [classes] = useFetch(fetchClasses);
  const [week, setWeek] = useState(0);
  let start = moment().startOf("week").add(week, "week");
  let end = moment().endOf("week").add(week, "week");

  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    fetchAttendance({
      start: start.format("YYYY-MM-DD"),
      end: end.format("YYYY-MM-DD"),
    }).then(({ error, data }) => {
      if (error === false) {
        setAttendance(
          data?.reduce((acc, data) => {
            if (data.class?._id) {
              if (acc[data.class._id]) {
                acc[data.class._id]["status"][
                  moment(data?.date).format("YYYY-MM-DD")
                ] = data.status;
              } else {
                acc[data.class._id] = {
                  name: data.class.name,
                  status: {
                    [moment(data?.date).format("YYYY-MM-DD")]: data.status,
                  },
                };
              }
            }
            return acc;
          }, {})
        );
      }
    });
  }, [week]);

  const icons = [
    <div
      className="border border-dark d-inline-block"
      style={{ width: 24, height: 24, borderRadius: 32 }}
    />,
    <FcCheckmark size={28} className="inline-block" />,
    <FcCancel size={28} className="inline-block" />,
    <div
      className="bg-warning d-inline-block"
      style={{ width: 24, height: 24, borderRadius: 32 }}
    />,
    <div className="position-relative d-inline-block" style={{ width: 32 }}>
      <FcCheckmark size={28} />
      <div
        className="position-absolute bg-danger"
        style={{
          width: 3,
          height: 15,
          top: 9,
          right: 12,
          transform: "rotate(-30deg)",
        }}
      />
    </div>,
    "",
  ];

  return (
    <>
      <div className="flex bg-white p-6 rounded-lg shadow-md items-center mt-8 hover:shadow-xl transition-all mb-5">
        <img className="h-20" src="/images/hello.svg" alt="" />
        <div>
          <p className="text-lg font-semibold pl-2 md:pl-8 mb-0">
            This is your attendance record! Switch between weeks to see your
            attendance history.
          </p>
        </div>
      </div>

      <div className="my-4 bg-white p-2 rounded-lg flex flex-wrap justify-between">
        <div className="d-flex p-2">
          {icons[1]}
          <h5 className="mx-2 font-weight-bold d-inline-block"> = Present</h5>
        </div>
        <div className="d-flex p-2">
          {icons[2]}
          <h5 className="mx-2 font-weight-bold d-inline-block"> = Absent</h5>
        </div>
        <div className="d-flex p-2">
          {icons[3]}
          <h5 className="mx-2 font-weight-bold d-inline-block"> = Tardy</h5>
        </div>
        <div className="d-flex p-2">
          {icons[4]}
          <h5 className="mx-2 font-weight-bold d-inline-block">
            {" "}
            = Left Early
          </h5>
        </div>
        <div className="d-flex p-2">
          {icons[0]}
          <h5 className="mx-2 font-weight-bold d-inline-block">
            {" "}
            = Attendance Not Logged
          </h5>
        </div>
      </div>
      <div className="bg-white rounded-lg">
        <div className="table-responsive">
          <Table noBorder className="table">
            <thead>
              <tr>
                <th style={{ borderTop: "none", minWidth: 200 }} />
                {classes?.map((data) => (
                  <th
                    className="border-l border-t-white text-center"
                    style={{ borderTop: "none", minWidth: 200 }}
                  >
                    {data?.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 7 }).map((_, index) => (
                <tr>
                  <td className="ps-5">
                    {start?.clone().add(index, "day").format("MMM DD, YYYY")}
                  </td>
                  {classes?.map((data) => (


                    <td
                      style={{ minWidth: 200 }}
                      className="border-l text-center border-gray-300"
                    >
                      {
                        icons[
                        attendance[data._id]?.status[
                        start
                          ?.clone()
                          .add(index, "day")
                          .format("YYYY-MM-DD")
                        ] || 0
                        ]

                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="toggle-container d-flex flex-xl-row flex-lg-row flex-md-row flex-sm-column justify-content-between px-4 mt-2">
            <button
              className="btn btn-primary mb-4"
              onClick={() => setWeek((week) => week - 1)}
            >
              &#10094; Previous Week
            </button>
            <button
              className="btn btn-primary mb-4"
              onClick={() => setWeek((week) => week + 1)}
            >
              Following Week &#10095;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
Attendance.layout = StudentLayout;
export default Attendance;
