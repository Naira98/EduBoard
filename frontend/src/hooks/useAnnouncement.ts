import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import {
  clearAnnouncementError,
  clearCurrentAnnouncement,
  createAnnouncement,
  deleteAnnouncement,
  fetchAllAnnouncements,
  fetchAnnouncementById,
  updateAnnouncement,
} from "../store/slices/announcementSlice";
import type {
  CreateAnnouncementData,
  GetAllAnnouncementsParams,
  UpdateAnnouncementData,
} from "../types/Announcement";

export const useAnnouncement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { announcements, currentAnnouncement, loading, error } = useSelector(
    (state: RootState) => state.announcement
  );

  const create = useCallback(
    (announcementData: CreateAnnouncementData) => {
      return dispatch(createAnnouncement(announcementData));
    },
    [dispatch]
  );

  const fetchAll = useCallback(
    (params?: GetAllAnnouncementsParams) => {
      return dispatch(fetchAllAnnouncements(params));
    },
    [dispatch]
  );

  const fetchById = useCallback(
    (announcementId: string) => {
      return dispatch(fetchAnnouncementById(announcementId));
    },
    [dispatch]
  );

  const update = useCallback(
    (updateData: UpdateAnnouncementData) => {
      return dispatch(updateAnnouncement(updateData));
    },
    [dispatch]
  );

  const remove = useCallback(
    (announcementId: string) => {
      return dispatch(deleteAnnouncement(announcementId));
    },
    [dispatch]
  );

  const resetError = useCallback(() => {
    dispatch(clearAnnouncementError());
  }, [dispatch]);

  const resetCurrentAnnouncement = useCallback(() => {
    dispatch(clearCurrentAnnouncement());
  }, [dispatch]);

  return {
    announcements,
    currentAnnouncement,
    loading,
    error,
    create,
    fetchAll,
    fetchById,
    update,
    remove,
    resetError,
    resetCurrentAnnouncement,
  };
};
