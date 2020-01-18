import React from "react";
import styled from "styled-components";
interface IProps {
  bpLg?: number;
  bpMd?: number;
  colLg?: number;
  colMd?: number;
  colSm?: number;
  gutterLen?: number;
  containerClass?: string;
  monthContainerClass?: string;
  dayContainerClass?: string;
  dayContainerWidth?: number;
  pickClass?: string;
  inputClass?: string;
}
interface IDay {
  day: number;
  isActive: boolean;
}
/**
 * in props
 * @param {number} bpLg - breakPoint for lg size, default 992.
 * @param {number} bpMd - breakPoint for md size, default 768.
 * @param {number} colLg - colNum in lg size, a row contain 12 col, default 3.
 * @param {number} colMd - colNum in md size, default 4.
 * @param {number} colSm - colNum smaller than md size, default 12.
 * @param {number} gutterLen - gutter between col, default 15(px).
 * @param {number} dayContainerWidth - default 30(px).
 * @param {string} containerClass - class for all almanac container.
 * @param {string} monthContainerClass - class for single month container.
 * @param {string} dayContainerClass - class for single day container.
 * @param {string} pickClass - class for pick container.
 * @param {string} inputClass - class for pick container.
 */
export default function Alamnac(props: IProps) {
  const {
    bpLg = 992,
    bpMd = 768,
    colLg = 3,
    colMd = 4,
    colSm = 12,
    gutterLen = 15,
    dayContainerWidth = 30,
    containerClass = "",
    monthContainerClass = "",
    dayContainerClass = "",
    pickClass = "",
    inputClass = ""
  } = props;
  const data = React.useRef({
    today: new Date(),
    dayNumOfMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    monthName: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "Septemper",
      "October",
      "November",
      "December"
    ],
    dayOfWeekName: ["S", "M", "T", "W", "T", "F", "S"]
  });
  const [year, setYear] = React.useState<number>(
    data.current.today.getFullYear()
  );
  const [almanacData, setAlmanacData] = React.useState<IDay[][][]>([]);
  const makeAlmanac = React.useCallback((year: number): IDay[][][] => {
    let almanacArr: IDay[][][] = [];
    const _dayNumOfMonth = [...data.current.dayNumOfMonth]; //copy
    const checkLeapYear = (_year: number): void => {
      //檢查閏年
      if (_year % 4 === 0) {
        _dayNumOfMonth[1] = 29;
      } else {
        _dayNumOfMonth[1] = 28;
      }
    };
    checkLeapYear(year);
    const fill = (monthIndex: number) => {
      let monthArr: IDay[][] = [];
      let weekArr: IDay[] = [];
      //遞迴每一月
      let dayCount = 0;
      for (
        //遞迴每一週
        //第一周起始index為一號的禮拜幾
        //取得Y年 X月一號是禮拜幾
        //注意，0為星期天
        //注意，月份0為一月
        let dayOfWeek = new Date(year, monthIndex, 1).getDay();
        dayCount < _dayNumOfMonth[monthIndex]; //到那個月最後一天
        dayOfWeek++
      ) {
        dayCount += 1;
        weekArr[dayOfWeek] = { day: dayCount, isActive: true }; //在X周的禮拜Y加上日期
        if (dayCount === _dayNumOfMonth[monthIndex] || dayOfWeek === 6) {
          //這禮拜run完 或是已經到最後一周+已經到當月最後一天
          monthArr.push([...weekArr]);
          weekArr = [];
          dayOfWeek = -1;
        }
      }
      almanacArr.push([...monthArr]);
      monthArr = [];
    };
    const fill_BeforeVacancy = (monthIndex: number) => {
      //填補一號之前的空缺
      let dayOfWeek = new Date(year, monthIndex, 1).getDay();
      let dateOfWeekbeforeMonth = new Date(year, monthIndex, 0).getDate();
      for (let index = dayOfWeek - 1; index > -1; index--) {
        almanacArr[monthIndex][0][index] = {
          day: dateOfWeekbeforeMonth,
          isActive: false
        };
        dateOfWeekbeforeMonth -= 1;
      }
    };
    const fill_AfterVacancy = (monthIndex: number) => {
      //填補當月最後一天之後的空缺
      const month = almanacArr[monthIndex];
      if (month.length === 6 && month[month.length - 1].length === 7) {
        //如果當好最後一天是第六周的禮拜六
        return;
      }
      let dayCount = 0;
      while (true) {
        const weekLen = month.length;
        const dayLength_Of_LastWeek = month[weekLen - 1].length;
        dayCount += 1;
        if (weekLen === 6 && dayLength_Of_LastWeek === 7) {
          //如果已經滿六周，且第六周已經到禮拜六，跳出
          break;
        } else if (dayLength_Of_LastWeek === 7) {
          month.push([{ day: dayCount, isActive: false }]); //如果未滿六周，且最後一周到禮拜六，+一周
        } else {
          month[weekLen - 1].push({ day: dayCount, isActive: false }); //如果未滿六周，且最後一周還沒到禮拜六，+一天
        }
      }
    };
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      fill(monthIndex);
      fill_BeforeVacancy(monthIndex);
      fill_AfterVacancy(monthIndex);
    }
    return almanacArr;
  }, []);
  React.useEffect(() => {
    setAlmanacData(makeAlmanac(year));
  }, [year]);
  React.useEffect(() => {
    pickToday(year);
  }, [almanacData]);
  const handleCLickShow = () => {
    const inputEl = document.getElementById(
      "almanac-input"
    ) as HTMLInputElement;
    if (inputEl) {
      const _value = Number(inputEl.value);
      if (_value > 9999 || _value < 1 || Math.floor(_value) !== _value) {
        alert("請輸入介於1~9999之間的整數");
        return;
      }
      setYear(_value);
    }
  };
  const pickToday = (_year: number): void => {
    if (_year !== data.current.today.getFullYear()) {
      return;
    }
    const monthIndex = data.current.today.getMonth();
    const date = data.current.today.getDate();
    const el = document.querySelector(
      `[data-monthanddate='${monthIndex},${date}']`
    );
    el?.classList.add("almanac-day--pick");
    if (pickClass) {
      el?.classList.add(pickClass);
    }
  };
  const Almanac = styled.section`
  *{
    box-sizing:border-box;
  }
  .input-container{
    text-align:center;
    margin-bottom:15px;
  }
    .almanac-container {
      width: 100%;
      padding-right: ${`${gutterLen}px`};
      padding-left: ${`${gutterLen}px`};
      margin-right: auto;
      margin-left: auto;
    }
    .almanac-row {
      margin-left: ${`-${gutterLen}px`};
      margin-right: ${`-${gutterLen}px`};
      display: flex;
      flex-wrap: wrap;
    }
    .almanac-month {
      position: relative;
      width: 100%;
      min-height: 1px;
      padding-right: ${`${gutterLen}px`};
      padding-left: ${`${gutterLen}px`};
      margin-bottom:15px;
      @media (min-width: ${`${bpLg}px`}) {
        width:${`${(100 * colLg) / 12}%`};
        }
      @media (max-width:  ${`${bpLg}px`}) and (min-width: ${`${bpMd}px`}) {
          width:${`${(100 * colMd) / 12}%`};
        }
      @media (max-width: ${`${bpMd}px`}) {
          width:${`${(100 * colSm) / 12}%`};
        }
      }
    }
    .almanac-dayOfWeekName {
      font-weight:700;
    }
    .almanac-week {
      white-space:nowrap;
      display:block;
      margin-left:auto;
      margin-right:auto;
      width: ${dayContainerWidth * 7 + "px"};
    }
    .almanac-monthName{
      text-align:left;
      font-weight:700;
    }
    .almanac-day {
      display: inline-flex;
      width: ${dayContainerWidth + "px"};
      height: ${dayContainerWidth + "px"};
      justify-content:center;
      align-items:center;
    }
    .almanac-day--notActive {
      color:gray;
    }
    .almanac-day--pick {
      border-radius:50%;
      color:white;
      background-color:#456789;
    }
  `;
  return (
    <Almanac data-testid="almanacWrapper">
      {almanacData.length === 0 ? (
        <div>loading</div>
      ) : (
        <>
          <div className={`input-container ${inputClass}`}>
            <input
              type="number"
              defaultValue={year}
              id="almanac-input"
              data-testid="almanac-input"
            />
            <button
              type="button"
              data-testid="almanac-showBtn"
              onClick={() => handleCLickShow()}
            >
              SHOW
            </button>
          </div>
          <div className={`almanac-container ${containerClass}`}>
            <div className="almanac-row">
              {almanacData.map((monthData, monthIndex) => (
                <div
                  className={`almanac-month ${monthContainerClass}`}
                  key={monthIndex}
                >
                  <div className="almanac-week almanac-monthName">
                    {data.current.monthName[monthIndex]}
                  </div>
                  <div className="almanac-week">
                    {data.current.dayOfWeekName.map(
                      (dayOfWeekName, dayOfWeekNameIndex) => (
                        <span
                          className={`almanac-day almanac-dayOfWeekName ${dayContainerClass}`}
                          key={dayOfWeekNameIndex}
                        >
                          {dayOfWeekName}
                        </span>
                      )
                    )}
                  </div>
                  {monthData.map((weekData, weekIndex) => (
                    <div
                      className="almanac-week"
                      key={weekIndex}
                      data-testid="week"
                    >
                      {weekData.map((dayData, dayIndex) => (
                        <span
                          className={`almanac-day ${dayData.isActive ||
                            "almanac-day--notActive"} ${dayContainerClass}`}
                          key={dayData.day}
                          data-monthanddate={
                            dayData.isActive && `${monthIndex},${dayData.day}`
                          }
                        >
                          {dayData.day}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Almanac>
  );
}
