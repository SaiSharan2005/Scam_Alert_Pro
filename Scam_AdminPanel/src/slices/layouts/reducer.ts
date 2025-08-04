import { createSlice } from "@reduxjs/toolkit";
//constants
import {
  LAYOUT_TYPES,
  LAYOUT_SEMI_DARK,
  LAYOUT_SKIN,
  LAYOUT_MODE_TYPES,
  LAYOUT_DIRECTION,
  LAYOUT_CONTENT_WIDTH,
  LEFT_SIDEBAR_SIZE_TYPES,
  LEFT_NAVIGATION_TYPES,
  LEFT_SIDEBAR_COLOR_TYPES,
  LAYOUT_TOPBAR_THEME_TYPES,
} from "Common/constants/layout";

export interface LayoutState {
  layoutType: LAYOUT_TYPES.HORIZONTAL | LAYOUT_TYPES.VERTICAL;
  layoutSemiDarkType: LAYOUT_SEMI_DARK.LIGHT | LAYOUT_SEMI_DARK.DARK;
  layoutSkintype: LAYOUT_SKIN.DEFAULT | LAYOUT_SKIN.BORDERED;
  layoutModeType: LAYOUT_MODE_TYPES.LIGHTMODE | LAYOUT_MODE_TYPES.DARKMODE;
  layoutDirectionType: LAYOUT_DIRECTION.LTR | LAYOUT_DIRECTION.RTL;
  layoutContentWidthType:
    | LAYOUT_CONTENT_WIDTH.FLUID
    | LAYOUT_CONTENT_WIDTH.BOXED;
  layoutSidebarSizeType:
    | LEFT_SIDEBAR_SIZE_TYPES.DEFAULT
    | LEFT_SIDEBAR_SIZE_TYPES.COMPACT
    | LEFT_SIDEBAR_SIZE_TYPES.SMALLICON;
  layoutNavigationType:
    | LEFT_NAVIGATION_TYPES.STICKY
    | LEFT_NAVIGATION_TYPES.SCROLL
    | LEFT_NAVIGATION_TYPES.BORDERED
    | LEFT_NAVIGATION_TYPES.HIDDEN;
  layoutSidebarColorType:
    | LEFT_SIDEBAR_COLOR_TYPES.LIGHT
    | LEFT_SIDEBAR_COLOR_TYPES.DARK
    | LEFT_SIDEBAR_COLOR_TYPES.BRAND
    | LEFT_SIDEBAR_COLOR_TYPES.MODERN;
  layoutTopbarColorType:
    | LAYOUT_TOPBAR_THEME_TYPES.LIGHT
    | LAYOUT_TOPBAR_THEME_TYPES.DARK
    | LAYOUT_TOPBAR_THEME_TYPES.BRAND;
}

export const initialState: LayoutState = {
  layoutType:
    (localStorage.getItem("layoutType") as any) || LAYOUT_TYPES.VERTICAL,
  layoutSemiDarkType:
    (localStorage.getItem("layoutSemiDarkType") as any) ||
    LAYOUT_SEMI_DARK.LIGHT,
  layoutSkintype:
    (localStorage.getItem("layoutSkintype") as any) || LAYOUT_SKIN.DEFAULT,
  layoutModeType:
    (localStorage.getItem("layoutModeType") as any) ||
    LAYOUT_MODE_TYPES.LIGHTMODE,
  layoutDirectionType:
    (localStorage.getItem("layoutDirectionType") as any) ||
    LAYOUT_DIRECTION.LTR,
  layoutContentWidthType:
    (localStorage.getItem("layoutContentWidthType") as any) ||
    LAYOUT_CONTENT_WIDTH.FLUID,
  layoutSidebarSizeType:
    (localStorage.getItem("layoutSidebarSizeType") as any) ||
    LEFT_SIDEBAR_SIZE_TYPES.DEFAULT,
  layoutNavigationType:
    (localStorage.getItem("layoutNavigationType") as any) ||
    LEFT_NAVIGATION_TYPES.STICKY,
  layoutSidebarColorType:
    (localStorage.getItem("layoutSidebarColorType") as any) ||
    LEFT_SIDEBAR_COLOR_TYPES.LIGHT,
  layoutTopbarColorType:
    (localStorage.getItem("layoutTopbarColorType") as any) ||
    LAYOUT_TOPBAR_THEME_TYPES.LIGHT,
};

const LayoutSlice = createSlice({
  name: "LayoutSlice",
  initialState,
  reducers: {
    changeLayoutAction(state: any, action: any) {
      state.layoutType = action.payload;
      localStorage.setItem("layoutType", action.payload);
    },
    changeLayoutSemiDarkAction(state: any, action: any) {
      state.layoutSemiDarkType = action.payload;
      localStorage.setItem("layoutSemiDarkType", action.payload);
    },
    changeSkinAction(state: any, action: any) {
      state.layoutSkintype = action.payload;
      localStorage.setItem("layoutSkintype", action.payload);
    },
    changeLayoutModeAction(state: any, action: any) {
      state.layoutModeType = action.payload;
      localStorage.setItem("layoutModeType", action.payload);
    },
    changeDirectionAction(state: any, action: any) {
      state.layoutDirectionType = action.payload;
      localStorage.setItem("layoutDirectionType", action.payload);
    },
    changeLayoutContentWidthAction(state: any, action: any) {
      state.layoutContentWidthType = action.payload;
      localStorage.setItem("layoutContentWidthType", action.payload);
    },
    changeLayoutSidebarSizeAction(state: any, action: any) {
      state.layoutSidebarSizeType = action.payload;
      localStorage.setItem("layoutSidebarSizeType", action.payload);
    },
    changeNavigationAction(state: any, action: any) {
      state.layoutNavigationType = action.payload;
      localStorage.setItem("layoutNavigationType", action.payload);
    },
    changeLeftSidebarColorTypeAction(state: any, action: any) {
      state.layoutSidebarColorType = action.payload;
      localStorage.setItem("layoutSidebarColorType", action.payload);
    },
    changeLayoutTopbarColorAction(state: any, action: any) {
      state.layoutTopbarColorType = action.payload;
      localStorage.setItem("layoutTopbarColorType", action.payload);
    },
  },
});

export const {
  changeLayoutAction,
  changeLayoutSemiDarkAction,
  changeSkinAction,
  changeLayoutModeAction,
  changeDirectionAction,
  changeLayoutContentWidthAction,
  changeLayoutSidebarSizeAction,
  changeNavigationAction,
  changeLeftSidebarColorTypeAction,
  changeLayoutTopbarColorAction,
} = LayoutSlice.actions;

export default LayoutSlice.reducer;
