import { Book, Home } from "iconsax-reactjs";

export const Path = {
  home: {
    path: "/",
    name: "Home",
    icon: Home,
    root: {
      courses: {
        path: "/course",
        name: "Courses",
        icon: Book,
        root: {
          sub_courses: {
            path: "/course/course_1",
            name: "Course - Course-1",
            icon: Book,
          },
        },
      },
    },
  },
};
