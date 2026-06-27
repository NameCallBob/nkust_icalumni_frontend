import React from "react";
import { Button, Field } from "components/common/ui";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaLine, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import Axios from "common/Axios";
import { toast } from "react-toastify";
import SEO from 'SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ContactUsPage = () => {

    const handleSubmit = async (event) => {
      event.preventDefault();

      const formData = {
        name: event.target.formName.value,
        email: event.target.formEmail.value,
        phone: event.target.formPhone.value,
        message: event.target.formMessage.value,
      };

      try {
        const response = await Axios().post("record/contact/" , formData)

        if (response) {
          toast.success("提交成功，講有專員為您服務～")
        } else {
          toast.warn("提交失敗，請注意資訊是否填寫正確")
        }
      } catch (error) {
        toast.error("伺服器忙碌中，請稍後再試！")
      }
    };

  return (
    <div className="container mx-auto px-4 py-5">
       <SEO
       main={false}
      title="聯絡我們"
      description="若有任何疑問或建議，歡迎聯絡智慧商務系友會，我們將竭誠為您服務。"
      keywords={["智慧商務", "聯絡我們", "客服"]}
    />
      {/* Google Map */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <div className="mb-4">
          <div style={{ width: "100%", height: "300px", overflow: "hidden", borderRadius: "10px" }}>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.0610532783326!2d120.32608597615351!3d22.651512179435628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e04d91d096a91%3A0x75ce7e7f7c793c56!2z5ZyL56uL6auY6ZuE56eR5oqA5aSn5a24IOW7uuW3peagoeWNgA!5e0!3m2!1szh-TW!2stw!4v1731937467206!5m2!1szh-TW!2stw"
              style={{ border: 0, width: "100%", height: "100%" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </motion.div>

      {/* 聯絡資訊 */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <div className="flex justify-center mb-5">
          <div className="w-full lg:w-2/3">
            <div className="card card-bordered bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <h2 className="text-center text-2xl font-bold mb-4">聯絡資訊</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-primary" style={{ fontSize: "1.5rem" }} />
                    <div>
                      <strong>電話：</strong>
                      <p className="mb-0">07-3814526 轉 17501</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-primary" style={{ fontSize: "1.5rem" }} />
                    <div>
                      <strong>信箱：</strong>
                      <p className="mb-0">
                        <a href="mailto:icdaa2019@nkust.edu.tw">icdaa2019@nkust.edu.tw</a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" style={{ fontSize: "1.5rem" }} />
                    <div>
                      <strong>地址：</strong>
                      <p className="mb-0">807高雄市三民區建工路415號</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-primary" style={{ fontSize: "1.5rem" }} />
                    <div>
                      <strong>營業時間：</strong>
                      <p className="mb-0">
                        週一～五 上午 09:00 - 17:00 <br /> 休息時間為12:00～13:30
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center text-center">
                  <div>
                    <a href="https://www.facebook.com/ic.nkust/?locale=zh_TW" target="_blank" rel="noopener noreferrer">
                      <FaFacebook className="text-primary mr-3 inline-block" style={{ fontSize: "1.5rem", transition: "0.3s", cursor: "pointer" }} />
                    </a>
                    <a href="https://line.me/R/ti/p/@261cygls" target="_blank" rel="noopener noreferrer">
                      <FaLine className="text-success mr-3 inline-block" style={{ fontSize: "1.5rem", transition: "0.3s", cursor: "pointer" }} />
                    </a>
                    <a href="https://www.instagram.com/ic.nkust/" target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="text-error inline-block" style={{ fontSize: "1.5rem", transition: "0.3s", cursor: "pointer" }} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 聯絡我們表單 */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2">
            <h2 className="text-center text-2xl font-bold mb-4">聯絡我們</h2>
            <p className="text-center text-base-content/60 mb-4">
              如果您有任何問題或建議，請填寫以下表單，我們將盡快與您聯繫！
            </p>
            <form onSubmit={handleSubmit}>
              <Field
                as="input"
                id="formName"
                type="text"
                label="姓名"
                placeholder="請輸入您的姓名"
                required
              />

              <Field
                as="input"
                id="formEmail"
                type="email"
                label="電子郵件"
                placeholder="請輸入您的電子郵件"
                required
              />

              <Field
                as="input"
                id="formPhone"
                type="text"
                label="聯絡電話"
                placeholder="請輸入您的聯絡電話"
              />

              <Field
                as="textarea"
                id="formMessage"
                rows={5}
                label="訊息內容"
                placeholder="請輸入您的訊息內容"
                required
              />

              <div className="text-center">
                <Button variant="primary" type="submit">
                  送出
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUsPage;
