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

const Colors = {
    VIVID_RED: "#f94144",
    BRIGHT_ORANGE: "#f3722c",
    LIGHT_ORANGE: "#f9844a",
    AMBER: "#f8961e",
    YELLOW: "#f9c74f",
    SOFT_GREEN: "#90be6d",
    AQUAMARINE: "#43aa8b",
    SLATE_GREEN: "#4d908e",
    DEEP_BLUE: "#277da1",
    MOUNTBATTEN_PINK: "#9A7197",
    PLUM: "#9B5094",
    RED_VIOLET: "#C71585",
};

const ActivityColors = {
    Unity: Colors.VIVID_RED,
    Creative: Colors.BRIGHT_ORANGE,
    Atly: Colors.LIGHT_ORANGE,
    Dates: Colors.AMBER,
    Pets: Colors.YELLOW,
    People: Colors.SOFT_GREEN,
    Read: Colors.AQUAMARINE,
    OP: Colors.SLATE_GREEN,
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
        data: []
    },
    {
        order: 6,
        name: "People",
        icon: Users,
        color: ActivityColors.People,
        data: []
    },
    {
        order: 8,
        name: "OP",
        icon: Skull,
        color: ActivityColors.OP,
        data: []
    },
    {
        order: 12,
        name: "Gym",
        icon: Barbell,
        color: ActivityColors.Gym,
        data: []
    },

    {
        order: 1,
        name: "Unity",
        icon: PuzzlePiece,
        color: ActivityColors.Unity,
        data: []
    },
    {
        order: 4,
        name: "Dates",
        icon: Heart,
        color: ActivityColors.Dates,
        data: []
    },
    {
        order: 7,
        name: "Read",
        icon: BookOpen,
        color: ActivityColors.Read,
        data: []
    },
    {
        order: 10,
        name: "Sleep",
        icon: MoonStars,
        color: ActivityColors.Sleep,
        data: []
    },
    {
        order: 2,
        name: "Creative",
        icon: PaintBrush,
        color: ActivityColors.Creative,
        data: []
    },
    {
        order: 5,
        name: "Pets",
        icon: PawPrint,
        color: ActivityColors.Pets,
        data: []
    },
    {
        order: 9,
        name: "Media",
        icon: Television,
        color: ActivityColors.Media,
        data: []
    },
    {
        order: 11,
        name: "Games",
        icon: GameController,
        color: ActivityColors.Games,
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