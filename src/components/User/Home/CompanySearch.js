import React, { useState , useEffect} from 'react';
import TabsComponent from 'components/User/Home/CompanyTabs';
import CompanyListWithPagination from 'components/User/Home/CompanyList';
import "css/user/homepage/CompanySearch.css"
import Axios from 'common/Axios';
import LoadingSpinner from 'components/LoadingSpinner';

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
      Axios().get('company/industry/all/')
      .then((res) => {
        setCategories(res.data)
      })
      
      // 搜尋公司
      if(prev_category != selectedCategory){

        Axios().get('company/search/',{
          "industry":selectedCategory
        })
        .then((res) => {
          setCompanies(res.data.results)
        })      

        setPrev_category(selectedCategory)
      
      }
      setLoading(false)
      
    },[selectedCategory])

    if (loading){
      return  <LoadingSpinner / >
    }

    return (
      <div>
        <TabsComponent
          categories={categories}
          onCategorySelect={setSelectedCategory}
          activeCategory={selectedCategory} // 傳遞目前選中的類別
        />
        <CompanyListWithPagination
          companies={companies[selectedCategory] || []}
        />
      </div>
    );
  };

export default CompanyTabsSearch;
