export const responseAction = (name, method, data) => {
  const actions = {
    // Example
    name: {
      method: () => {},
    },
    // Event
    events: {
      post: () => {
        window.location.replace(`/dashboard/events/${data.newDoc._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-id="${data.deletedDoc._id}"]`).remove();
      },
      save_and_add_new: () => {
        window.location.replace('/dashboard/events/new');
      },
    },
    videos: {
      post: () => {
        window.location.replace(`/dashboard/videos/${data.newDoc._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-id="${data.deletedDoc._id}"]`).remove();
      },
      save_and_add_new: () => {
        window.location.replace('/dashboard/videos/new');
      },
    },
    tracks: {
      post: () => {
        window.location.replace(`/dashboard/tracks/${data.newDoc._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-id="${data.deletedDoc._id}"]`).remove();
      },
      save_and_add_new: () => {
        window.location.replace('/dashboard/tracks/new');
      },
    },
    blogposts: {
      post: () => {
        window.location.replace(`/dashboard/blogposts/${data.newDoc._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-id="${data.deletedDoc._id}"]`).remove();
      },
      save_and_add_new: () => {
        window.location.replace('/dashboard/blogposts/new');
      },
    },
  };

  if (actions[name] && actions[name][method]) {
    actions[name][method]();
  } else {
    // Default action or error handling
  }

  if (method === 'delete') recountDocuments();
};

const recountDocuments = () => {
  const dashboardSubheader = document.querySelector('.dashboard-subheader');
  if (!dashboardSubheader) return;

  const length = document.querySelectorAll('tbody tr').length;
  dashboardSubheader.innerText = length + ' document' + `${length === 1 ? '' : 's'}`;
};
