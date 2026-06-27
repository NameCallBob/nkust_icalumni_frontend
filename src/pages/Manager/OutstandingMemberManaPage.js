import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Badge,
  PageHeader,
  Toolbar,
  DataTable,
} from "components/common/ui";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Award,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  ListOrdered,
} from "lucide-react";
import Axios from "common/Axios";
import AddOutstandingAlumniModal from "components/Manage/OutstandingMana/OutstandingModal";
import EditOutstandingAlumniModal from "components/Manage/OutstandingMana/EditOutstandingModal";

const OutstandingAlumniPage = () => {
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

  // ===== presentation helpers =====
  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : (
        <ArrowDown className="h-3.5 w-3.5" />
      );
    }
    return <ArrowUpDown className="h-3.5 w-3.5 text-base-content/40" />;
  };

  const sortHeader = (field, label, align = "left") => (
    <button
      type="button"
      onClick={() => handleSort(field)}
      className={`inline-flex items-center gap-1 font-semibold transition-colors hover:text-primary ${
        align === "center" ? "mx-auto" : ""
      }`}
    >
      {label}
      {getSortIcon(field)}
    </button>
  );

  const featuredCell = (alumni) => (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        className="toggle toggle-success toggle-sm"
        checked={alumni.is_featured}
        onChange={() => toggleFeatured(alumni)}
      />
      <Badge variant={alumni.is_featured ? "success" : "neutral"}>
        {alumni.is_featured ? "展示中" : "未展示"}
      </Badge>
    </label>
  );

  const reorderCell = (globalIndex) => (
    <div className="inline-flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="btn-circle"
        onClick={() => moveUp(globalIndex)}
        disabled={globalIndex === 0}
        title="向上移動"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="btn-circle"
        onClick={() => moveDown(globalIndex)}
        disabled={globalIndex === sortedAlumni.length - 1}
        title="向下移動"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );

  const actionCell = (alumni) => (
    <div className="inline-flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setEditData(alumni);
          setShowEditModal(true);
        }}
      >
        <Pencil className="h-4 w-4" /> 編輯
      </Button>
      <Button
        variant="error"
        size="sm"
        className="btn-outline"
        onClick={() => handleDeleteAlumni(alumni.id)}
      >
        <Trash2 className="h-4 w-4" /> 刪除
      </Button>
    </div>
  );

  const columns = [
    {
      key: "order",
      header: "順序",
      className: "text-center w-20",
      render: (row, i) => (
        <Badge variant="primary" soft={false} className="text-sm">
          {row.sort_order ?? indexOfFirstAlumni + i + 1}
        </Badge>
      ),
    },
    {
      key: "name",
      header: sortHeader("name", "名稱"),
      render: (row) => (
        <span className="font-semibold text-base-content">{row.name}</span>
      ),
    },
    {
      key: "highlight",
      header: "摘要",
      render: (row) => (
        <span className="block max-w-[260px] truncate text-base-content/70">
          {row.highlight}
        </span>
      ),
    },
    {
      key: "is_featured",
      header: sortHeader("is_featured", "展示於官網", "center"),
      className: "text-center",
      render: (row) => featuredCell(row),
    },
    {
      key: "reorder",
      header: "排序調整",
      className: "text-center",
      render: (row, i) => reorderCell(indexOfFirstAlumni + i),
    },
    {
      key: "actions",
      header: "操作",
      className: "text-center",
      render: (row) => actionCell(row),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="傑出系友管理"
        subtitle="管理傑出系友資料並設置展示順序與狀態"
        icon={<Award className="h-5 w-5" />}
        actions={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" /> 新增傑出系友
          </Button>
        }
      />

      <Card padding="md">
        <Toolbar
          left={
            <div className="dropdown">
              <Button variant="outline" size="sm" tabIndex={0} id="dropdown-basic">
                <ListOrdered className="h-4 w-4" />
                排序：
                {sortField === "name"
                  ? "姓名"
                  : sortField === "sort_order"
                  ? "順序"
                  : "展示狀態"}
              </Button>
              <ul
                tabIndex={0}
                className="dropdown-content menu z-[1] mt-2 w-52 rounded-box bg-base-100 p-2 shadow-lg"
              >
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
          }
          right={
            <span className="text-sm text-base-content/50">
              共 {sortedAlumni.length} 位傑出系友
            </span>
          }
        />

        <DataTable
          columns={columns}
          data={currentAlumni}
          rowKey={(row) => row.id}
          loading={loading}
        />

        {!loading && totalPages > 1 && (
          <div className="join mt-6 flex justify-center">
            <button
              type="button"
              className="join-item btn btn-sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                type="button"
                key={index + 1}
                className={`join-item btn btn-sm ${
                  index + 1 === currentPage ? "btn-primary btn-active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              type="button"
              className="join-item btn btn-sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        )}
      </Card>

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
