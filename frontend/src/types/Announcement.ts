export interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; username: string; email?: string; role?: string };
  semester: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}
export interface CreateAnnouncementData {
  title: string;
  content: string;
  semesterId: string;
}
export interface UpdateAnnouncementData {
  id: string;
  title?: string;
  content?: string;
  semesterId?: string;
}
export interface GetAllAnnouncementsParams {
  semesterId?: string;
  authorId?: string;
  myAnnouncements?: string;
}
