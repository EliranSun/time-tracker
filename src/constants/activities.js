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
    Users,
    PersonSimpleTaiChi
} from "@phosphor-icons/react";

export const ACTIVITY_MINIMUM_TIME = 2 * 60 * 1000;


export const ColorNames = {
    IMPERIAL_RED: "IMPERIAL_RED",
    ORANGE: "ORANGE",
    CARROT_ORANGE: "CARROT_ORANGE",
    SELECTIVE_YELLOW: "SELECTIVE_YELLOW",
    SAFFRON: "SAFFRON",
    PISTACHIO: "PISTACHIO",
    ZOMP: "ZOMP",
    DARK_CYAN: "DARK_CYAN",
    DEEP_BLUE: "DEEP_BLUE",
    MOUNTBATTEN_PINK: "MOUNTBATTEN_PINK",
    PLUM: "PLUM",
    RED_VIOLET: "RED_VIOLET",
};

export const Colors = {
    [ColorNames.IMPERIAL_RED]: {value: "#f94144", order: 1, isBlocked: false},
    [ColorNames.ORANGE]: {value: "#f3722c", order: 5, isBlocked: true},
    [ColorNames.CARROT_ORANGE]: {value: "#F8961E", order: 9, isBlocked: true},
    [ColorNames.SELECTIVE_YELLOW]: {
        value: "#FFB300",
        order: 2,
        isBlocked: false,
        tags: ["optimism", "creativity", "clarity", "attention", "energy"],
    },
    [ColorNames.SAFFRON]: {
        value: "#f9c74f",
        order: 6,
        isBlocked: true,
        tags: ["luxury", "wealth", "spirituality", "tradition"]
    },
    [ColorNames.PISTACHIO]: {
        value: "#90be6d",
        order: 10,
        isBlocked: true,
        tags: ["freshness", "imagination", "renewal", "balance"]
    },
    [ColorNames.ZOMP]: {
        value: "#43aa8b",
        order: 3,
        isBlocked: false,
        tags: ["calmness", "environment", "balance", "reliability"]
    },
    [ColorNames.DARK_CYAN]: {
        value: "#4d908e",
        order: 7,
        isBlocked: true,
        tags: ["calmness", "environment", "depth", "elegance"]
    },
    [ColorNames.DEEP_BLUE]: {
        isBlocked: true, value: "#277da1", order: 11, tags: ["knowledge", "authority", "wisdom", "confidence"]
    },
    [ColorNames.MOUNTBATTEN_PINK]: {value: "#9A7197", order: 4, isBlocked: false},
    [ColorNames.PLUM]: {value: "#9B5094", order: 8, isBlocked: true},
    [ColorNames.RED_VIOLET]: {value: "#C71585", order: 12, isBlocked: true},
};

/*
*   IMPERIAL_RED  |  CORAL    |  ZOMP     |  MOUNTBATTEN_PINK
*   ORANGE        | SAFFRON   | DARK_CYAN | PLUM
*   CARROT_ORANGE | PISTACHIO | DEEP_BLUE | RED_VIOLET
* */

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
        name: "Spur",
        icon: PersonSimpleTaiChi,
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
    Spur: "Spur",
    Games: "Games",
    Gym: "Gym",
};

// four directional "map"
export const ActivitiesColorsMazeMap = {
    [ColorNames.IMPERIAL_RED]: {
        Up: ColorNames.CARROT_ORANGE,
        Down: ColorNames.ORANGE,
        Left: ColorNames.MOUNTBATTEN_PINK,
        Right: ColorNames.SELECTIVE_YELLOW
    },
    [ColorNames.ORANGE]: {
        Up: ColorNames.IMPERIAL_RED,
        Down: ColorNames.CARROT_ORANGE,
        Left: ColorNames.PLUM,
        Right: ColorNames.SAFFRON,
    },
    [ColorNames.CARROT_ORANGE]: {
        Up: ColorNames.ORANGE,
        Down: ColorNames.IMPERIAL_RED,
        Left: ColorNames.RED_VIOLET,
        Right: ColorNames.PISTACHIO,
    },
    [ColorNames.SELECTIVE_YELLOW]: {
        Up: ColorNames.PISTACHIO,
        Down: ColorNames.SAFFRON,
        Left: ColorNames.IMPERIAL_RED,
        Right: ColorNames.ZOMP,
    },
    [ColorNames.SAFFRON]: {
        Up: ColorNames.SELECTIVE_YELLOW,
        Down: ColorNames.PISTACHIO,
        Left: ColorNames.ORANGE,
        Right: ColorNames.DARK_CYAN,
    },
    [ColorNames.PISTACHIO]: {
        Up: ColorNames.SAFFRON,
        Down: ColorNames.SELECTIVE_YELLOW,
        Left: ColorNames.CARROT_ORANGE,
        Right: ColorNames.DEEP_BLUE,
    },
    [ColorNames.ZOMP]: {
        Up: ColorNames.DEEP_BLUE,
        Down: ColorNames.DARK_CYAN,
        Left: ColorNames.SELECTIVE_YELLOW,
        Right: ColorNames.MOUNTBATTEN_PINK,
    },
    [ColorNames.DARK_CYAN]: {
        Up: ColorNames.ZOMP,
        Down: ColorNames.DEEP_BLUE,
        Left: ColorNames.SAFFRON,
        Right: ColorNames.PLUM,
    },
    [ColorNames.DEEP_BLUE]: {
        Up: ColorNames.DARK_CYAN,
        Down: ColorNames.ZOMP,
        Left: ColorNames.PISTACHIO,
        Right: ColorNames.RED_VIOLET,
    },
    [ColorNames.MOUNTBATTEN_PINK]: {
        Up: ColorNames.RED_VIOLET,
        Down: ColorNames.PLUM,
        Left: ColorNames.ZOMP,
        Right: ColorNames.IMPERIAL_RED,
    },
    [ColorNames.PLUM]: {
        Up: ColorNames.MOUNTBATTEN_PINK,
        Down: ColorNames.RED_VIOLET,
        Left: ColorNames.DARK_CYAN,
        Right: ColorNames.ORANGE,
    },
    [ColorNames.RED_VIOLET]: {
        Up: ColorNames.PLUM,
        Down: ColorNames.MOUNTBATTEN_PINK,
        Left: ColorNames.DEEP_BLUE,
        Right: ColorNames.CARROT_ORANGE,
    },
};