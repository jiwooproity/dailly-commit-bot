import dayjs from "dayjs";

type ReturnTypes = [dayjs.Dayjs, number, string];

const getDate = (): ReturnTypes => {
  const today = dayjs(new Date());
  const year = today.year();
  const day = today.format("YYYY-MM-DD");

  return [today, year, day];
};

export default getDate;
