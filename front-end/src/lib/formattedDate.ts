import moment from "moment";
import "moment/locale/ko";

export default function formattedDate(date: Date): string {
  return moment(date).locale("ko").format("YYYY년 M월 D일 dddd HH:mm");
}
