
import { Tabs, Tab, Container, Table } from "react-bootstrap";


const TabContentTable = ({ data }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>時間</th>
          <th>標題</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.time}</td>
            <td>{item.title}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};


/**
 *
 * @param {*} params
 */
function News(params) {
    const allMeetingsData = [
        { time: "2024-09-25", title: "系友聯誼會" },
        { time: "2024-09-24", title: "技術交流會議" },
      ];

      const alumniNewsData = [
        { time: "2024-09-23", title: "校友捐贈儀式" },
        { time: "2024-09-22", title: "系友創業成功故事" },
      ];

      const eventLectureData = [
        { time: "2024-09-21", title: "AI與未來科技講座" },
        { time: "2024-09-20", title: "參訪創新科技企業" },
      ];

      const meetingData = [
        { time: "2024-09-19", title: "學術委員會會議" },
        { time: "2024-09-18", title: "校友會理事會議" },
      ];

      return (
        <Container className="my-4">
          <h3>最新消息</h3>
          <Tabs defaultActiveKey="allMeetings" id="news-tabs" className="mb-3">
            <Tab eventKey="allMeetings" title="所有會議">
              <TabContentTable data={allMeetingsData} />
            </Tab>
            <Tab eventKey="alumniNews" title="系友消息">
              <TabContentTable data={alumniNewsData} />
            </Tab>
            <Tab eventKey="eventLecture" title="活動/講座">
              <TabContentTable data={eventLectureData} />
            </Tab>
            <Tab eventKey="meetings" title="會議">
              <TabContentTable data={meetingData} />
            </Tab>
          </Tabs>
        </Container>
      );
}

export default News