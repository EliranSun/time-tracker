/*
*  |   Atly  | = | People | = | OP | = | Gym |
*       ||          ||         ||         ||
*  | Unity    | = | Dates | = | Read | = | Sleep |
*      ||           ||           ||           ||
*  | Creative | = | Pets | = | Media | = | Games |
* */
import {
    Barbell,
    BookOpen,
    Briefcase,
    GameController,
    Heart,
    MoonStars,
    PaintBrush,
    PawPrint,
    PuzzlePiece,
    Skull,
    Television,
    Users
} from "@phosphor-icons/react";

export const Activities = [
    {order: 3, name: "Atly", icon: Briefcase, color: "#f9844a", page: 1, orientationAngle: 270, data: []},
    {order: 6, name: "People", icon: Users, color: "#90be6d", page: 2, orientationAngle: 270, data: []},
    {order: 8, name: "OP", icon: Skull, color: "#4d908e", page: 3, orientationAngle: 90, data: []},
    {order: 11, name: "Gym", icon: Barbell, color: "#C71585", page: 4, orientationAngle: 270, data: []},

    {order: 1, name: "Unity", icon: PuzzlePiece, color: "#f94144", page: 1, orientationAngle: 0, data: []},
    {order: 4, name: "Dates", icon: Heart, color: "#f8961e", page: 2, orientationAngle: 0, data: []},
    {order: 7, name: "Read", icon: BookOpen, color: "#43aa8b", page: 3, orientationAngle: 0, data: []},
    {order: 10, name: "Sleep", icon: MoonStars, color: "#277da1", page: 4, orientationAngle: 0, data: []},

    {order: 2, name: "Creative", icon: PaintBrush, color: "#f3722c", page: 1, orientationAngle: 90, data: []},
    {order: 5, name: "Pets", icon: PawPrint, color: "#f9c74f", page: 2, orientationAngle: 90, data: []},
    {order: 9, name: "Media", icon: Television, color: "#577590", page: 3, orientationAngle: 270, data: []},
    {order: 12, name: "Games", icon: GameController, color: "#9400D3", page: 4, orientationAngle: 90, data: []},
];
const ActivitiesEnum = {
    Unity: "Unity",
    Creative: "Creative",
    Atly: "Atly",
    Dates: "Dates",
    Pets: "Pets",
    People: "People",
    Read: "Read",
    OP: "OP",
    Media: "Media",
    Sleep: "Sleep",
    Games: "Games",
    Gym: "Gym",
}
// four directional "map"
export const PageMazeMap = {
    Unity: {
        Up: ActivitiesEnum.Atly,
        Down: ActivitiesEnum.Creative,
        Left: ActivitiesEnum.Sleep,
        Right: ActivitiesEnum.Dates
    },
    Creative: {
        Up: ActivitiesEnum.Unity,
        Down: ActivitiesEnum.Atly,
        Left: ActivitiesEnum.Games,
        Right: ActivitiesEnum.Pets
    },
    Atly: {
        Up: ActivitiesEnum.Creative,
        Down: ActivitiesEnum.Unity,
        Left: ActivitiesEnum.Gym,
        Right: ActivitiesEnum.People
    },
    Dates: {
        Up: ActivitiesEnum.People,
        Down: ActivitiesEnum.Pets,
        Left: ActivitiesEnum.Unity,
        Right: ActivitiesEnum.Read,
    },
    Pets: {
        Up: ActivitiesEnum.Dates,
        Down: ActivitiesEnum.People,
        Left: ActivitiesEnum.Creative,
        Right: ActivitiesEnum.Media,
    },
    People: {
        Up: ActivitiesEnum.Pets,
        Down: ActivitiesEnum.Dates,
        Left: ActivitiesEnum.Atly,
        Right: ActivitiesEnum.OP,
    },
    Read: {
        Up: ActivitiesEnum.OP,
        Down: ActivitiesEnum.Media,
        Left: ActivitiesEnum.Dates,
        Right: ActivitiesEnum.Sleep,
    },
    OP: {
        Up: ActivitiesEnum.Media,
        Down: ActivitiesEnum.Read,
        Left: ActivitiesEnum.People,
        Right: ActivitiesEnum.Gym,
    },
    Media: {
        Up: ActivitiesEnum.Read,
        Down: ActivitiesEnum.OP,
        Left: ActivitiesEnum.Pets,
        Right: ActivitiesEnum.Games,
    },
    Sleep: {
        Up: ActivitiesEnum.Gym,
        Down: ActivitiesEnum.Games,
        Left: ActivitiesEnum.Read,
        Right: ActivitiesEnum.Unity,
    },
    Games: {
        Up: ActivitiesEnum.Sleep,
        Down: ActivitiesEnum.Gym,
        Left: ActivitiesEnum.Media,
        Right: ActivitiesEnum.Creative,
    },
    Gym: {
        Up: ActivitiesEnum.Games,
        Down: ActivitiesEnum.Sleep,
        Left: ActivitiesEnum.OP,
        Right: ActivitiesEnum.Atly,
    },
};