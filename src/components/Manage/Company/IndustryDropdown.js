import React from "react";
import { Form, InputGroup, FormText, Card } from "react-bootstrap";

const IndustryDropdown = ({ industries, company, handleInputChange }) => {
  // 產業分類分組顯示
  const groupedIndustries = {
    "製造業": industries.filter(i => i.title.includes("製造")),
    "服務業": industries.filter(i => i.title.includes("服務")),
    "科技業": industries.filter(i => i.title.includes("科技") || i.title.includes("電子") || i.title.includes("資訊")),
    "其他": industries.filter(i => !i.title.includes("製造") && !i.title.includes("服務") && !i.title.includes("科技") && !i.title.includes("電子") && !i.title.includes("資訊"))
  };

  return (
    <div>
      <Form.Group controlId="formIndustry" className="mb-4">
        <Form.Label style={{ fontSize: "18px", fontWeight: "500" }}>
          行業分類
        </Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <span className="text-primary">🏢</span>
          </InputGroup.Text>
          <Form.Control
            as="select"
            name="industry"
            value={company.industry}
            onChange={handleInputChange}
            style={{
              fontSize: "16px",
              padding: "12px",
              borderRadius: "8px",
              borderColor: "#ced4da",
            }}
          >
            <option value="">-- 請選擇行業分類 --</option>
            
            {Object.entries(groupedIndustries).map(([group, items]) => (
              items.length > 0 && (
                <optgroup label={group} key={group}>
                  {items.map((industry) => (
                    <option key={industry.id} value={industry.title}>
                      {industry.title}
                    </option>
                  ))}
                </optgroup>
              )
            ))}
          </Form.Control>
        </InputGroup>
        <FormText className="text-muted mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：選擇最能代表您公司的產業類型，這將幫助潛在客戶更容易找到您。</span>
        </FormText>
      </Form.Group>
      
      <Card className="bg-light mb-3">
        <Card.Body>
          <Card.Title style={{ fontSize: "16px" }}>為什麼選擇產業分類很重要？</Card.Title>
          <Card.Text>
            正確選擇產業分類有助於：
            <ul>
              <li>提高在相關搜尋中的曝光率</li>
              <li>讓有興趣的客戶更容易找到您</li>
              <li>與同產業公司建立更多合作機會</li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default IndustryDropdown;