import React, { useState } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import IndustryCRUD from 'components/Manage/Other/IndustryMana';
import AlumniPositionCRUD from 'components/Manage/Other/PositionMana';

const OtherManage = () => {
    const [activeKey, setActiveKey] = useState('industry');

    return (
      <Container>
        <Tabs
          id="controlled-tab"
          activeKey={activeKey}
          onSelect={(k) => setActiveKey(k)}
          className="mb-3"
        >
          <Tab eventKey="industry" title="公司產業別管理">
            <IndustryCRUD />
          </Tab>
          <Tab eventKey="position" title="系友會職稱管理">
            <AlumniPositionCRUD />
          </Tab>
        </Tabs>
      </Container>
    );
};

export default OtherManage;
