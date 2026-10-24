/**
 * API 服務層：把散落各頁的 Axios() 呼叫集中成具名函式。
 * 路徑 / method / payload 形狀取自重構前（commit 6db0bec^）各頁面的原始 Axios 呼叫，行為不變。
 * 每次呼叫都重新建立 Axios()，與全站其他地方一致。
 */
import Axios from '@/common/Axios';

export const memberService = {
  search: (params) => Axios().get('/member/search/', { params }),
  adminTableAll: () => Axios().get('/member/admin/tableOutput_all/'),
  adminGetOne: (params) => Axios().get('/member/admin/getOne/', { params }),
  adminNewBasic: (data) => Axios().post('/member/admin/newUser_basic/', data),
  adminNewEmail: (data) => Axios().post('/member/admin/newUser_email/', data),
  adminPartialChange: (data) => Axios().patch('/member/admin/partial_change/', data),
  adminSwitchActive: (data) => Axios().patch('/member/admin/switch_active/', data),
  adminSwitchPaid: (data) => Axios().patch('/member/admin/switch_paid/', data),
  adminUpdatePassword: (data) => Axios().patch('/member/admin/update_password/', data),
  adminDelete: (data) => Axios().delete('/member/admin/delete/', { data }),
};

export const positionService = {
  all: () => Axios().get('member/position/get-all/'),
};

export const recruitService = {
  myTableAdmin: () => Axios().get('/recruit/data/tableOutput_admin/'),
};

export const infoService = {
  latestConstitution: () => Axios().get('info/constitutions/latest/'),
};

/** 把後端回傳的媒體路徑轉成可直接使用的完整網址。已是完整網址或空值則原樣處理。 */
export function mediaUrl(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  return `${process.env.REACT_APP_BASE_URL || ''}${path}`;
}
