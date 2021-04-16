import React, { useState, useEffect } from 'react';
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import timeFrame from '../../json/officeHours.json';
import openingHours, { weekends } from '../../json/openingHours.json';
import picker from './Scheduler.module.css';

function Scheduler() {
  const [timeRange, setTimeRange] = useState([]);
  const [date, setDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [day, setDay] = useState('');

  useEffect(() => {
    checkTimeRange();
  }, [date]);

  const getOpenCloseHours = () => {
    if (
      day === 'monday' ||
      day === 'tuesday' ||
      day === 'wednesday' ||
      day === 'thursday' ||
      day === 'friday'
    ) {
      return {
        open: openingHours.open,
        close: openingHours.open,
      };
    }

    if (day === 'saturday') {
      return {
        open: weekends.saturday.open,
        close: weekends.saturday.close,
      };
    }

    return {
      open: weekends.sunday.open,
      close: weekends.sunday.close,
    };
  };

  const getTimeRange = () => {
    const hours = getOpenCloseHours();
    const openHour = Number(hours.open.split(':')[0]);
    const closeHour = Number(hours.close.split(':')[0]);
    const range = [];
    timeFrame.forEach((time) => {
      const t = Number(time.split(':')[0]);
      if (t >= openHour && t < closeHour) {
        range.push(time);
      }
    });

    return range;
  };

  const checkTimeRange = () => {
    const openHours = getTimeRange();
    const range = [];

    const isToday = moment(date).isSame(moment().format('YYYY-MM-DD'), 'day');

    if (isToday) {
      openHours.forEach((time) => {
        if (Number(time.split(':')[0] > moment().hour())) {
          range.push(time);
        }
      });

      return setTimeRange(range);
    }
    setTimeRange(openHours);
  };

  const disabledDate = (current) =>
    current && current < moment().startOf('day');

  const handleDate = (date) => {
    if (date) {
      setDay(moment(date).format('dddd').toLowerCase());
      setDate(date.format('YYYY-MM-DD'));
    }
  };

  const chooseTime = ({ target: time }) => {
    const timeArr = time.textContent.split('-');
    setPickupTime(timeArr[0]);
    setDeliveryTime(timeArr[1]);
  };

  return (
    <div className={picker.container}>
      <div className={picker.dateTime}>
        <div className={picker.date}>
          <header className={picker.dateTitle}>Select Date</header>
          <Space direction="horizontal">
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
              onChange={handleDate}
            />
          </Space>
        </div>

        {date && (
          <div className={picker.time}>
            <header className={picker.timeTitle}>Select Time</header>

            <div className={picker.grid}>
              {timeRange.map((time, index) => (
                <div
                  className={picker.timeList}
                  key={index}
                  onClick={(e) => chooseTime(e)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Scheduler;
