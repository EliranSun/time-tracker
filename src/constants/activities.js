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

export const ACTIVITY_MINIMUM_TIME = 2 * 60 * 1000;

export const Colors = {
    IMPERIAL_RED: "#f94144",
    ORANGE: "#f3722c",
    CARROT_ORANGE: "#F8961E",

    CORAL: "#FFB300",
    SAFFRON: "#f9c74f",
    PISTACHIO: "#90be6d",

    ZOMP: "#43aa8b",
    DARK_CYAN: "#4d908e",
    DEEP_BLUE: "#277da1",

    MOUNTBATTEN_PINK: "#9A7197",
    PLUM: "#9B5094",
    RED_VIOLET: "#C71585",
};

const ActivityColors = {
    Unity: Colors.IMPERIAL_RED,
    Creative: Colors.ORANGE,
    Atly: Colors.CARROT_ORANGE,

    Dates: Colors.CORAL,
    Pets: Colors.SAFFRON,
    People: Colors.PISTACHIO,

    Read: Colors.ZOMP,
    OP: Colors.DARK_CYAN,
    Media: Colors.DEEP_BLUE,

    Sleep: Colors.MOUNTBATTEN_PINK,
    Games: Colors.PLUM,
    Gym: Colors.RED_VIOLET,
};

export const Activities = [
    {
        order: 3,
        name: "Atly",
        icon: Briefcase,
        color: ActivityColors.Atly,
        priority: 5,
        data: []
    },
    {
        order: 6,
        name: "People",
        icon: Users,
        color: ActivityColors.People,
        priority: 4,
        data: []
    },
    {
        order: 8,
        name: "OP",
        icon: Skull,
        color: ActivityColors.OP,
        priority: 3,
        data: []
    },
    {
        order: 12,
        name: "Gym",
        icon: Barbell,
        color: ActivityColors.Gym,
        priority: 6,
        data: []
    },

    {
        order: 1,
        name: "Unity",
        icon: PuzzlePiece,
        color: ActivityColors.Unity,
        priority: 1,
        data: []
    },
    {
        order: 4,
        name: "Dates",
        icon: Heart,
        color: ActivityColors.Dates,
        priority: 2,
        data: []
    },
    {
        order: 7,
        name: "Read",
        icon: BookOpen,
        color: ActivityColors.Read,
        priority: 7,
        data: []
    },
    {
        order: 10,
        name: "Sleep",
        icon: MoonStars,
        color: ActivityColors.Sleep,
        priority: 9,
        data: []
    },
    {
        order: 2,
        name: "Creative",
        icon: PaintBrush,
        color: ActivityColors.Creative,
        priority: 8,
        data: []
    },
    {
        order: 5,
        name: "Pets",
        icon: PawPrint,
        color: ActivityColors.Pets,
        priority: 10,
        data: []
    },
    {
        order: 9,
        name: "Media",
        icon: Television,
        color: ActivityColors.Media,
        priority: 12,
        data: []
    },
    {
        order: 11,
        name: "Games",
        icon: GameController,
        color: ActivityColors.Games,
        priority: 11,
        data: []
    },
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