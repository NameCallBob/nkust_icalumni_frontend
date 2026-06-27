import React, { useState, useEffect } from "react";
import {
  Button,
  Badge,
  PageHeader,
  Toolbar,
  DataTable,
  EmptyState,
} from "components/common/ui";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Award,
  ArrowDownAZ,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  ArrowUpDown,
  Plus,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
} from "lucide-react";
import Axios from "common/Axios";
import useRWD from "hooks/useRWD";
import AddOutstandingAlumniModal from "components/Manage/OutstandingAlumniMana/OutstandingAlumniModal";
import EditOutstandingAlumniModal from "components/Manage/OutstandingAlumniMana/EditOutstandingAlumniModal";

const OutstandingAlumniManaPage = () => {
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
      const res = await Axios().get("member/school-outstanding-alumni/");
      setAlumniList(res.data.results || []);
    } catch (err) {
      toast.error("無法載入資料，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlumni = async (data) => {
    try {
      await Axios().post("member/school-outstanding-alumni/", data);
      toast.success("新增成功");
      setShowAddModal(false);
      fetchAlumniList();
    } catch (err) {
      toast.error("新增失敗，請稍後再試");
    }
  };

  const handleEditAlumni = async (data) => {
    try {
      await Axios().patch(`member/school-outstanding-alumni/${data.id}/`, data);
      toast.success("更新成功");
      setShowEditModal(false);
      fetchAlumniList();
    } catch (err) {
      toast.error("更新失敗，請稍後再試");
    }
  };

  const toggleFeatured = async (alumni) => {
    try {
      await Axios().patch(`/member/school-outstanding-alumni/${alumni.id}/`, {
        is_featured: !alumni.is_featured,
      });
      toast.success(`已${alumni.is_featured ? "取消" : "設置"}展示於官網`);
      fetchAlumniList();
    } catch (err) {
      toast.error("無法更新展示狀態");
    }
  };

  const handleDeleteAlumni = (id) => {
    if (window.confirm("確定要刪除此傑出校友嗎？")) {
      Axios()
        .delete(`/member/school-outstanding-alumni/${id}/`)
        .then(() => {
          toast.success("刪除成功");
          fetchAlumniList();
        })
        .catch((err) => {
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
        Axios().patch(`member/school-outstanding-alumni/${update.id}/`, {
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
        <ArrowUpNarrowWide className="ml-1 inline-block h-3.5 w-3.5" />
      ) : (
        <ArrowDownWideNarrow className="ml-1 inline-block h-3.5 w-3.5" />
      );
    }
    return <ArrowUpDown className="ml-1 inline-block h-3.5 w-3.5 text-base-content/40" />;
  };

  const sortLabel =
    sortField === "name" ? "姓名" : sortField === "sort_order" ? "順序" : "展示狀態";

  const columns = [
    {
      key: "sort_order",
      header: "順序",
      className: "text-center w-20",
      render: (row, i) => (
        <Badge variant="primary" soft={false}>
          {row.sort_order ?? indexOfFirstAlumni + i + 1}
        </Badge>
      ),
    },
    {
      key: "name",
      header: (
        <button
          type="button"
          className="inline-flex items-center font-medium hover:text-primary"
          onClick={() => handleSort("name")}
        >
          名稱 {getSortIcon("name")}
        </button>
      ),
      render: (row) => <span className="font-medium text-base-content">{row.name}</span>,
    },
    {
      key: "highlight",
      header: "摘要",
      render: (row) => (
        <span className="block max-w-xs truncate text-base-content/70 md:max-w-[260px]">
          {row.highlight}
        </span>
      ),
    },
    {
      key: "is_featured",
      header: (
        <button
          type="button"
          className="inline-flex items-center font-medium hover:text-primary"
          onClick={() => handleSort("is_featured")}
        >
          展示於官網 {getSortIcon("is_featured")}
        </button>
      ),
      className: "text-center",
      render: (row) => (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={row.is_featured}
            onChange={() => toggleFeatured(row)}
          />
          <Badge variant={row.is_featured ? "success" : "neutral"}>
            {row.is_featured ? "展示中" : "未展示"}
          </Badge>
        </label>
      ),
    },
    {
      key: "reorder",
      header: "排序調整",
      className: "text-center",
      render: (row, i) => {
        const globalIndex = indexOfFirstAlumni + i;
        return (
          <div className="inline-flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveUp(globalIndex)}
              disabled={globalIndex === 0}
              title="向上移動"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveDown(globalIndex)}
              disabled={globalIndex === sortedAlumni.length - 1}
              title="向下移動"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "操作",
      className: "text-center",
      render: (row) => (
        <div className="inline-flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditData(row);
              setShowEditModal(true);
            }}
          >
            <Pencil className="mr-1 inline-block h-4 w-4" /> 編輯
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => handleDeleteAlumni(row.id)}
          >
            <Trash2 className="mr-1 inline-block h-4 w-4" /> 刪除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6" style={rwd.getContainerStyle()}>
      <PageHeader
        title="傑出校友管理"
        subtitle="管理傑出校友資料並設置展示順序與狀態"
        icon={<Award className="h-5 w-5" />}
        actions={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="mr-1.5 inline-block h-4 w-4" /> 新增傑出校友
          </Button>
        }
      />

      <Toolbar
        left={
          <div className="dropdown">
            <label tabIndex={0} id="dropdown-basic" className="btn btn-outline btn-sm gap-2">
              <ArrowDownAZ className="h-4 w-4" />
              排序：{sortLabel}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg"
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
      />

      <DataTable
        columns={columns}
        data={currentAlumni}
        rowKey={(row) => row.id}
        loading={loading}
        empty={<EmptyState title="尚無傑出校友資料" description="點擊右上角新增傑出校友。" />}
      />

      {!loading && totalPages > 1 && (
        <div className="join flex justify-center mt-6">
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
                index + 1 === currentPage ? "btn-active btn-primary" : ""
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            className="join-item btn btn-sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
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

export default OutstandingAlumniManaPage;
