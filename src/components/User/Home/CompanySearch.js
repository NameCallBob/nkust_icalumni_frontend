import React, { useState , useEffect} from 'react';
import TabsComponent from 'components/User/Home/CompanyTabs';
import CompanyListWithPagination from 'components/User/Home/CompanyList';
import { Section, Spinner } from 'components/common/ui';

import Axios from 'common/Axios';

const CompanyTabsSearch = () => {

    // 行業別（用ID進行保存及查詢）
    const [prev_category,setPrev_category] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(1);
    // 結果
    const [categories,setCategories] = useState([])
    const [companies,setCompanies] = useState([])
    // loading
    const [loading,setLoading] = useState(true)


    useEffect(() => {
      // 導入所有行業別
      if (categories.length == 0){
        Axios().get('company/industry/all/')
        .then((res) => {
          setCategories(res.data)
      })
      }

      // 搜尋公司
      if(prev_category != selectedCategory){
        Axios().get('company/search/',{params:{
          "industry":selectedCategory
        }
        })
        .then((res) => {
          setCompanies(res.data.results)
        })

        setPrev_category(selectedCategory)

      }
      setLoading(false)

    },[selectedCategory])

    if (loading){
      return (
        <Section width="wide">
          <Spinner center label="載入系友企業資料中…" />
        </Section>
      );
    }

    return (
      <Section
        eyebrow="Alumni Enterprises"
        title="系友企業探索"
        subtitle="依產業別瀏覽智慧商務系系友所經營與服務的企業，建立彼此交流與合作的橋樑。"
        center
        width="wide"
      >
        <div className="space-y-8">
          {/* 產業別分頁切換 */}
          <div className="rounded-2xl bg-base-100 ring-1 ring-base-200 shadow-sm p-2 sm:p-3">
            <TabsComponent
              categories={categories}
              onCategorySelect={setSelectedCategory}
              activeCategory={selectedCategory} // 傳遞目前選中的類別
            />
          </div>

          {/* 企業列表 */}
          <CompanyListWithPagination
            companies={companies || []}
          />
        </div>
      </Section>
    );
  };

export default CompanyTabsSearch;
