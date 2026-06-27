import React, { useState, useEffect } from "react";
import { Button, Spinner } from "components/common/ui";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Axios from "common/Axios";
import AddOutstandingAlumniModal from "components/Manage/OutstandingMana/OutstandingModal";
import EditOutstandingAlumniModal from "components/Manage/OutstandingMana/EditOutstandingModal";
import useRWD from 'hooks/useRWD';

const OutstandingAlumniPage = () => {
  const rwd = useRWD();
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [sortField, setSortField] = useState("sort_order");
  const [sortDirection, setSortDirection] = useState("asc");
  const alumniPerPage = 5;

  useEffect(() => {
    fetchAlumniList();
  }, []);

  const fetchAlumniList = async () => {
    setLoading(true);
    try {
      const res = await Axios().get("member/outstanding-alumni/");
      setAlumniList(res.data.results);
    } catch (err) {
      toast.error("無法載入資料，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlumni = async (data) => {
    try {
      await Axios().post("member/outstanding-alumni/", data);
      toast.success("新增成功");
      setShowAddModal(false);
      fetchAlumniList();
    } catch (err) {
      // console.error("Error adding alumni:", err);
      toast.error("新增失敗，請稍後再試");
    }
  };

  const handleEditAlumni = async (data) => {
    try {
      await Axios().patch(`member/outstanding-alumni/${data.id}/`, data);
      toast.success("更新成功");
      setShowEditModal(false);
      fetchAlumniList();
    } catch (err) {
      // console.error("Error editing alumni:", err);
      toast.error("更新失敗，請稍後再試");
    }
  };

  const toggleFeatured = async (alumni) => {
    try {
      await Axios().patch(`/member/outstanding-alumni/${alumni.id}/`, {
        is_featured: !alumni.is_featured,
      });
      toast.success(`已${alumni.is_featured ? "取消" : "設置"}展示於官網`);
      fetchAlumniList();
    } catch (err) {
      // console.error("Error toggling featured status:", err);
      toast.error("無法更新展示狀態");
    }
  };

  const handleDeleteAlumni = (id) => {
    if (window.confirm("確定要刪除此傑出系友嗎？")) {
      Axios()
        .delete(`/member/outstanding-alumni/${id}/`)
        .then(() => {
          toast.success("刪除成功");
          fetchAlumniList();
        })
        .catch((err) => {
          // console.error("Error deleting alumni:", err);
          toast.error("刪除失敗，請稍後再試");
        });
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const moveUp = async (index) => {
    if (index === 0) return;

    const newList = [...sortedAlumni];
    [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];

    try {
      await updateOrder(newList);
      toast.success("順序已更新");
    } catch (err) {
      toast.error("更新順序失敗");
    }
  };

  const moveDown = async (index) => {
    if (index === sortedAlumni.length - 1) return;

    const newList = [...sortedAlumni];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];

    try {
      await updateOrder(newList);
      toast.success("順序已更新");
    } catch (err) {
      toast.error("更新順序失敗");
    }
  };

  const updateOrder = async (newList) => {
    const updates = newList.map((item, index) => ({
      id: item.id,
      sort_order: index + 1,
    }));

    await Promise.all(
      updates.map((update) =>
        Axios().patch(`member/outstanding-alumni/${update.id}/`, {
          sort_order: update.sort_order,
        })
      )
    );

    fetchAlumniList();
  };

  const sortedAlumni = [...alumniList].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortField === "sort_order") {
      const orderA = a.sort_order ?? 999;
      const orderB = b.sort_order ?? 999;
      return sortDirection === "asc" ? orderA - orderB : orderB - orderA;
    } else if (sortField === "is_featured") {
      return sortDirection === "asc"
        ? (a.is_featured ? 1 : 0) - (b.is_featured ? 1 : 0)
        : (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    }
    return 0;
  });

  const indexOfLastAlumni = currentPage * alumniPerPage;
  const indexOfFirstAlumni = indexOfLastAlumni - alumniPerPage;
  const currentAlumni = sortedAlumni.slice(indexOfFirstAlumni, indexOfLastAlumni);
  const totalPages = Math.ceil(sortedAlumni.length / alumniPerPage);

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <i className="bi bi-sort-up ml-1"></i>
      ) : (
        <i className="bi bi-sort-down ml-1"></i>
      );
    }
    return <i className="bi bi-arrow-down-up ml-1 text-base-content/60"></i>;
  };

  // 渲染卡片式佈局（移動設備）
  const renderMobileCards = () => (
    <div className="block md:hidden">
      {currentAlumni.map((alumni, index) => {
        const globalIndex = indexOfFirstAlumni + index;
        return (
          <div key={alumni.id} className="card card-bordered bg-base-100 shadow-sm mb-3">
            <div className="card-body">
              <div className="flex justify-between items-start mb-2">
                <h5 className="card-title mb-0">{alumni.name}</h5>
                <span className="badge badge-neutral text-base">
                  {alumni.sort_order ?? globalIndex + 1}
                </span>
              </div>

              <p className="text-base-content/60 mb-3">{alumni.highlight}</p>

              <div className="flex justify-between items-center mb-3">
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={alumni.is_featured}
                      onChange={() => toggleFeatured(alumni)}
                    />
                    <span className={`badge ${alumni.is_featured ? "badge-success" : "badge-ghost"}`}>
                      {alumni.is_featured ? "展示中" : "未展示"}
                    </span>
                  </label>
                </div>
                <div className="join">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-outline join-item"
                    onClick={() => moveUp(globalIndex)}
                    disabled={globalIndex === 0}
                    title="向上移動"
                    style={rwd.getButtonStyle()}
                  >
                    <i className="bi bi-arrow-up"></i>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-outline join-item"
                    onClick={() => moveDown(globalIndex)}
                    disabled={globalIndex === sortedAlumni.length - 1}
                    title="向下移動"
                    style={rwd.getButtonStyle()}
                  >
                    <i className="bi bi-arrow-down"></i>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditData(alumni);
                    setShowEditModal(true);
                  }}
                  style={rwd.getButtonStyle()}
                >
                  <i className="bi bi-pencil"></i> 編輯
                </Button>
                <Button
                  variant="error"
                  size="sm"
                  className="btn-outline"
                  onClick={() => handleDeleteAlumni(alumni.id)}
                  style={rwd.getButtonStyle()}
                >
                  <i className="bi bi-trash"></i> 刪除
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="admin-container container mx-auto px-4 py-4" style={rwd.getContainerStyle()}>
      <div className="flex flex-col md:flex-row md:items-center mb-4">
        <div className="flex-1">
          <h1 className="font-bold text-2xl">傑出系友管理</h1>
          <p className="text-base-content/60">管理傑出系友資料並設置展示順序與狀態</p>
        </div>
        <div className={rwd.isMobile ? "text-left mt-3" : "text-right"}>
          <div className={`flex ${rwd.isMobile ? "flex-col" : "flex-row"} items-stretch`}>
            <div className="dropdown">
              <Button
                variant="ghost"
                tabIndex={0}
                className="btn-outline"
                id="dropdown-basic"
                style={rwd.getButtonStyle()}
              >
                <i className="bi bi-sort-alpha-down mr-2"></i>
                排序：{sortField === "name" ? "姓名" : sortField === "sort_order" ? "順序" : "展示狀態"}
              </Button>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li>
                  <button type="button" onClick={() => handleSort("sort_order")}>
                    依順序排序
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleSort("name")}>
                    依姓名排序
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleSort("is_featured")}>
                    依展示狀態排序
                  </button>
                </li>
              </ul>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className={rwd.isMobile ? "mt-2 rounded-full px-4" : "ml-2 rounded-full px-4"}
              style={rwd.getButtonStyle()}
            >
              <i className="bi bi-plus-lg mr-2"></i> 新增傑出系友
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner size="lg" />
          <p className="text-base-content/60 mt-2">載入中...</p>
        </div>
      ) : (
        <>
          {rwd.isMobile ? (
            renderMobileCards()
          ) : (
            <div className="overflow-x-auto hidden md:block">
              <table className="table table-zebra shadow-sm" style={rwd.getTableStyle()}>
                <thead className="bg-base-200">
                  <tr>
                    <th className="text-center" style={{ width: "80px" }}>
                      順序
                    </th>
                    <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                      名稱 {getSortIcon("name")}
                    </th>
                    <th>摘要</th>
                    <th
                      className="text-center"
                      onClick={() => handleSort("is_featured")}
                      style={{ cursor: "pointer" }}
                    >
                      展示於官網 {getSortIcon("is_featured")}
                    </th>
                    <th className="text-center">排序調整</th>
                    <th className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAlumni.map((alumni, index) => {
                    const globalIndex = indexOfFirstAlumni + index;
                    return (
                      <tr key={alumni.id}>
                        <td className="text-center">
                          <span className="badge badge-neutral text-base">
                            {alumni.sort_order ?? globalIndex + 1}
                          </span>
                        </td>
                        <td>{alumni.name}</td>
                        <td className="truncate" style={{ maxWidth: "250px" }}>
                          {alumni.highlight}
                        </td>
                        <td className="text-center">
                          <label className="flex items-center justify-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="toggle toggle-success"
                              checked={alumni.is_featured}
                              onChange={() => toggleFeatured(alumni)}
                            />
                            <span className={`badge ${alumni.is_featured ? "badge-success" : "badge-ghost"}`}>
                              {alumni.is_featured ? "展示中" : "未展示"}
                            </span>
                          </label>
                        </td>
                        <td className="text-center">
                          <div className="join">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="btn-outline join-item"
                              onClick={() => moveUp(globalIndex)}
                              disabled={globalIndex === 0}
                              title="向上移動"
                              style={rwd.getButtonStyle()}
                            >
                              <i className="bi bi-arrow-up"></i>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="btn-outline join-item"
                              onClick={() => moveDown(globalIndex)}
                              disabled={globalIndex === sortedAlumni.length - 1}
                              title="向下移動"
                              style={rwd.getButtonStyle()}
                            >
                              <i className="bi bi-arrow-down"></i>
                            </Button>
                          </div>
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => {
                              setEditData(alumni);
                              setShowEditModal(true);
                            }}
                            style={rwd.getButtonStyle()}
                          >
                            <i className="bi bi-pencil"></i> 編輯
                          </Button>
                          <Button
                            variant="error"
                            size="sm"
                            className="btn-outline"
                            onClick={() => handleDeleteAlumni(alumni.id)}
                            style={rwd.getButtonStyle()}
                          >
                            <i className="bi bi-trash"></i> 刪除
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="join flex justify-center mt-4">
              <button
                type="button"
                className="join-item btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                «
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  type="button"
                  key={index + 1}
                  className={`join-item btn ${index + 1 === currentPage ? "btn-active btn-primary" : ""}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                className="join-item btn"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          )}
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <AddOutstandingAlumniModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAlumni}
      />

      {editData && (
        <EditOutstandingAlumniModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          data={editData}
          onSubmit={handleEditAlumni}
        />
      )}
    </div>
  );
};

export default OutstandingAlumniPage;
