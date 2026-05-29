
import type { ServiceType } from '../data/catalog';
import type { Playlist, WatchHistoryItem, Notification, ChatMessage } from './useAppStore';

export const INITIAL_SUBSCRIPTIONS: Record<string, ServiceType[]> = {
  "2": [
    "Netflix",
    "HBO Max",
    "Disney Plus"
  ],
  "3": [
    "Oneplay",
    "Prime Video",
    "Apple TV",
    "SkyShowtime"
  ],
  "4": [
    "Netflix",
    "HBO Max",
    "Prime Video",
    "Disney Plus",
    "Oneplay"
  ],
  "5": [
    "Netflix",
    "SkyShowtime",
    "Apple TV"
  ]
};
export const INITIAL_FRIENDS: Record<string, string[]> = {
  "2": [
    "3",
    "4"
  ],
  "3": [
    "2"
  ],
  "4": [
    "2"
  ]
};
export const INITIAL_WATCH_HISTORY: Record<string, WatchHistoryItem[]> = {
  "2": [
    {
      "titleId": "1439930",
      "watchedAt": 1777837639470.1094,
      "service": "Disney Plus",
      "durationMinutes": 51
    },
    {
      "titleId": "1007757",
      "watchedAt": 1779028350203.667,
      "service": "Netflix",
      "durationMinutes": 102
    },
    {
      "titleId": "350",
      "watchedAt": 1779208989742.777,
      "service": "Disney Plus",
      "durationMinutes": 109
    },
    {
      "titleId": "1318447",
      "watchedAt": 1778744854624.6113,
      "service": "Netflix",
      "durationMinutes": 96
    },
    {
      "titleId": "1198994",
      "watchedAt": 1778100736526.377,
      "service": "Disney Plus",
      "durationMinutes": 113
    },
    {
      "titleId": "1330021",
      "watchedAt": 1779216188646.4187,
      "service": "Netflix",
      "durationMinutes": 114
    },
    {
      "titleId": "1613798",
      "watchedAt": 1777351305053.1023,
      "service": "Prime Video",
      "durationMinutes": 103
    },
    {
      "titleId": "755898",
      "watchedAt": 1779075836623.1392,
      "service": "Prime Video",
      "durationMinutes": 91
    },
    {
      "titleId": "1242898",
      "watchedAt": 1777027844008.5796,
      "service": "Disney Plus",
      "durationMinutes": 107
    },
    {
      "titleId": "157336",
      "watchedAt": 1777173029709.1013,
      "service": "Netflix",
      "durationMinutes": 169
    },
    {
      "titleId": "76479",
      "watchedAt": 1777710314980.6016,
      "service": "Prime Video",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "124364",
      "watchedAt": 1779266175383.6555,
      "service": "HBO Max",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "79744",
      "watchedAt": 1778266616340.4895,
      "service": "Disney Plus",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "1622",
      "watchedAt": 1779240815622.3313,
      "service": "HBO Max",
      "durationMinutes": 45,
      "episodesWatched": 1
    }
  ],
  "3": [
    {
      "titleId": "1439930",
      "watchedAt": 1778644223091.8801,
      "service": "Disney Plus",
      "durationMinutes": 51
    },
    {
      "titleId": "1007757",
      "watchedAt": 1777720129959.746,
      "service": "Netflix",
      "durationMinutes": 102
    },
    {
      "titleId": "350",
      "watchedAt": 1777597153665.7224,
      "service": "Disney Plus",
      "durationMinutes": 109
    },
    {
      "titleId": "1318447",
      "watchedAt": 1778952803755.0674,
      "service": "Netflix",
      "durationMinutes": 96
    },
    {
      "titleId": "1198994",
      "watchedAt": 1777713091006.528,
      "service": "Disney Plus",
      "durationMinutes": 113
    },
    {
      "titleId": "1330021",
      "watchedAt": 1778202683906.9956,
      "service": "Netflix",
      "durationMinutes": 114
    },
    {
      "titleId": "1613798",
      "watchedAt": 1779309701316.0342,
      "service": "Prime Video",
      "durationMinutes": 103
    },
    {
      "titleId": "755898",
      "watchedAt": 1778630195676.2642,
      "service": "Prime Video",
      "durationMinutes": 91
    },
    {
      "titleId": "1242898",
      "watchedAt": 1779044524481.6091,
      "service": "Disney Plus",
      "durationMinutes": 107
    },
    {
      "titleId": "157336",
      "watchedAt": 1779419124909.412,
      "service": "Netflix",
      "durationMinutes": 169
    },
    {
      "titleId": "76479",
      "watchedAt": 1778480688054.2412,
      "service": "Prime Video",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "124364",
      "watchedAt": 1777542531303.0566,
      "service": "HBO Max",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "79744",
      "watchedAt": 1779300217886.732,
      "service": "Netflix",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "1622",
      "watchedAt": 1777451999507.3276,
      "service": "HBO Max",
      "durationMinutes": 45,
      "episodesWatched": 1
    }
  ],
  "4": [
    {
      "titleId": "1439930",
      "watchedAt": 1777397560150.9868,
      "service": "Disney Plus",
      "durationMinutes": 51
    },
    {
      "titleId": "1007757",
      "watchedAt": 1778882220751.9553,
      "service": "Netflix",
      "durationMinutes": 102
    },
    {
      "titleId": "350",
      "watchedAt": 1778763716525.674,
      "service": "Disney Plus",
      "durationMinutes": 109
    },
    {
      "titleId": "1318447",
      "watchedAt": 1777462886903.624,
      "service": "Netflix",
      "durationMinutes": 96
    },
    {
      "titleId": "1198994",
      "watchedAt": 1779560140828.8835,
      "service": "Disney Plus",
      "durationMinutes": 113
    },
    {
      "titleId": "1330021",
      "watchedAt": 1778980232959.399,
      "service": "Netflix",
      "durationMinutes": 114
    },
    {
      "titleId": "1613798",
      "watchedAt": 1778960440529.4453,
      "service": "Prime Video",
      "durationMinutes": 103
    },
    {
      "titleId": "755898",
      "watchedAt": 1777942673276.167,
      "service": "Prime Video",
      "durationMinutes": 91
    },
    {
      "titleId": "1242898",
      "watchedAt": 1779118072336.472,
      "service": "Disney Plus",
      "durationMinutes": 107
    },
    {
      "titleId": "157336",
      "watchedAt": 1779028705090.8972,
      "service": "Netflix",
      "durationMinutes": 169
    },
    {
      "titleId": "76479",
      "watchedAt": 1778275585028.1904,
      "service": "Prime Video",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "124364",
      "watchedAt": 1777736711639.7153,
      "service": "HBO Max",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "79744",
      "watchedAt": 1778887916584.683,
      "service": "Netflix",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "1622",
      "watchedAt": 1778748698745.4736,
      "service": "HBO Max",
      "durationMinutes": 45,
      "episodesWatched": 1
    }
  ],
  "5": [
    {
      "titleId": "1439930",
      "watchedAt": 1778214648685.0955,
      "service": "Disney Plus",
      "durationMinutes": 51
    },
    {
      "titleId": "1007757",
      "watchedAt": 1778580150682.3506,
      "service": "Netflix",
      "durationMinutes": 102
    },
    {
      "titleId": "350",
      "watchedAt": 1776984252689.9624,
      "service": "Disney Plus",
      "durationMinutes": 109
    },
    {
      "titleId": "1318447",
      "watchedAt": 1777560855282.813,
      "service": "Netflix",
      "durationMinutes": 96
    },
    {
      "titleId": "1198994",
      "watchedAt": 1779446073709.2952,
      "service": "Disney Plus",
      "durationMinutes": 113
    },
    {
      "titleId": "1330021",
      "watchedAt": 1777385344310.752,
      "service": "Netflix",
      "durationMinutes": 114
    },
    {
      "titleId": "1613798",
      "watchedAt": 1779518490592.6145,
      "service": "Prime Video",
      "durationMinutes": 103
    },
    {
      "titleId": "755898",
      "watchedAt": 1777092737012.9414,
      "service": "Prime Video",
      "durationMinutes": 91
    },
    {
      "titleId": "1242898",
      "watchedAt": 1778764409855.3533,
      "service": "Disney Plus",
      "durationMinutes": 107
    },
    {
      "titleId": "157336",
      "watchedAt": 1777039816794.4539,
      "service": "Netflix",
      "durationMinutes": 169
    },
    {
      "titleId": "76479",
      "watchedAt": 1778060576141.1287,
      "service": "Prime Video",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "124364",
      "watchedAt": 1777779178599.902,
      "service": "HBO Max",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "79744",
      "watchedAt": 1778835507848.3616,
      "service": "Netflix",
      "durationMinutes": 0,
      "episodesWatched": 1
    },
    {
      "titleId": "1622",
      "watchedAt": 1779353340420.633,
      "service": "HBO Max",
      "durationMinutes": 45,
      "episodesWatched": 1
    }
  ]
};
export const INITIAL_PLAYLISTS: Record<string, Playlist[]> = {
  "2": [
    {
      "id": "pl-2-1",
      "name": "Akčňáky",
      "titleIds": [
        "1439930",
        "1318447",
        "1613798"
      ]
    },
    {
      "id": "pl-2-2",
      "name": "Rodinné",
      "titleIds": [
        "1007757",
        "1198994"
      ]
    }
  ],
  "3": [
    {
      "id": "pl-3-1",
      "name": "Romantika",
      "titleIds": [
        "350",
        "1330021"
      ]
    },
    {
      "id": "pl-3-2",
      "name": "Na odreagování",
      "titleIds": [
        "755898",
        "1242898"
      ]
    }
  ],
  "4": [
    {
      "id": "pl-4-1",
      "name": "K zamyšlení",
      "titleIds": [
        "157336",
        "7451"
      ]
    },
    {
      "id": "pl-4-2",
      "name": "Sci-fi a Fantasy",
      "titleIds": [
        "1171145",
        "318256"
      ]
    }
  ],
  "5": [
    {
      "id": "pl-5-1",
      "name": "Stará klasika",
      "titleIds": [
        "278",
        "24428"
      ]
    },
    {
      "id": "pl-5-2",
      "name": "Nové filmy",
      "titleIds": [
        "1439930",
        "1007757"
      ]
    }
  ]
};
export const INITIAL_WATCHLISTS: Record<string, string[]> = {
  "2": [
    "350",
    "755898",
    "1622"
  ],
  "3": [
    "350",
    "755898",
    "1622"
  ],
  "4": [
    "350",
    "755898",
    "1622"
  ],
  "5": [
    "350",
    "755898",
    "1622"
  ]
};
export const INITIAL_MESSAGE_HISTORY: Record<string, ChatMessage[]> = {
  "2": [
    {
      "id": "8de7ebaqh",
      "fromUserId": "2",
      "toUserId": "3",
      "timestamp": 1779114291674.743,
      "type": "RECOMMENDED_TITLE",
      "message": "Tohle musíš vidět!",
      "titleId": "1439930"
    },
    {
      "id": "fbfpd6ygl",
      "fromUserId": "3",
      "toUserId": "2",
      "timestamp": 1779084630469.6191,
      "type": "RECOMMENDED_TITLE",
      "message": "Pecka na večer",
      "titleId": "1007757"
    },
    {
      "id": "gej0yk86c",
      "fromUserId": "2",
      "toUserId": "4",
      "timestamp": 1779159674184.2866,
      "type": "RECOMMENDED_TITLE",
      "message": "Tohle by se ti mohlo líbit",
      "titleId": "350"
    },
    {
      "id": "nx3vsloqt",
      "fromUserId": "4",
      "toUserId": "2",
      "timestamp": 1779139500027.9846,
      "type": "RECOMMENDED_TITLE",
      "message": "Klasika",
      "titleId": "1318447"
    },
    {
      "id": "fs03r2e8y",
      "fromUserId": "2",
      "toUserId": "5",
      "timestamp": 1778973350299.327,
      "type": "RECOMMENDED_TITLE",
      "message": "Něco na víkend",
      "titleId": "1198994"
    },
    {
      "id": "8hq5tu0aa",
      "fromUserId": "5",
      "toUserId": "2",
      "timestamp": 1779415743112.35,
      "type": "RECOMMENDED_TITLE",
      "message": "Super film",
      "titleId": "1330021"
    },
    {
      "id": "kqgcwdk5z",
      "fromUserId": "2",
      "toUserId": "3",
      "timestamp": 1779177832775.569,
      "type": "SHARED_PLAYLIST",
      "message": "Moje oblíbené akčňáky",
      "playlist": {
        "id": "pl-2-1",
        "name": "Akčňáky",
        "titleIds": [
          "1439930",
          "1318447",
          "1613798"
        ]
      }
    },
    {
      "id": "smrxwwypd",
      "fromUserId": "3",
      "toUserId": "2",
      "timestamp": 1779382495457.234,
      "type": "SHARED_PLAYLIST",
      "message": "Doporučuji",
      "playlist": {
        "id": "pl-3-1",
        "name": "Romantika",
        "titleIds": [
          "350",
          "1330021"
        ]
      }
    },
    {
      "id": "2hc2k85mg",
      "fromUserId": "4",
      "toUserId": "2",
      "timestamp": 1779560053215.5374,
      "type": "SHARED_PLAYLIST",
      "message": "Koukni na tohle",
      "playlist": {
        "id": "pl-4-1",
        "name": "K zamyšlení",
        "titleIds": [
          "157336",
          "7451"
        ]
      }
    },
    {
      "id": "e7acg8twx",
      "fromUserId": "5",
      "toUserId": "2",
      "timestamp": 1779066179253.629,
      "type": "SHARED_PLAYLIST",
      "message": "Dobrá klasika",
      "playlist": {
        "id": "pl-5-1",
        "name": "Stará klasika",
        "titleIds": [
          "278",
          "24428"
        ]
      }
    }
  ],
  "3": [
    {
      "id": "8de7ebaqh",
      "fromUserId": "2",
      "toUserId": "3",
      "timestamp": 1779114291674.743,
      "type": "RECOMMENDED_TITLE",
      "message": "Tohle musíš vidět!",
      "titleId": "1439930"
    },
    {
      "id": "fbfpd6ygl",
      "fromUserId": "3",
      "toUserId": "2",
      "timestamp": 1779084630469.6191,
      "type": "RECOMMENDED_TITLE",
      "message": "Pecka na večer",
      "titleId": "1007757"
    },
    {
      "id": "kqgcwdk5z",
      "fromUserId": "2",
      "toUserId": "3",
      "timestamp": 1779177832775.569,
      "type": "SHARED_PLAYLIST",
      "message": "Moje oblíbené akčňáky",
      "playlist": {
        "id": "pl-2-1",
        "name": "Akčňáky",
        "titleIds": [
          "1439930",
          "1318447",
          "1613798"
        ]
      }
    },
    {
      "id": "smrxwwypd",
      "fromUserId": "3",
      "toUserId": "2",
      "timestamp": 1779382495457.234,
      "type": "SHARED_PLAYLIST",
      "message": "Doporučuji",
      "playlist": {
        "id": "pl-3-1",
        "name": "Romantika",
        "titleIds": [
          "350",
          "1330021"
        ]
      }
    }
  ],
  "4": [
    {
      "id": "gej0yk86c",
      "fromUserId": "2",
      "toUserId": "4",
      "timestamp": 1779159674184.2866,
      "type": "RECOMMENDED_TITLE",
      "message": "Tohle by se ti mohlo líbit",
      "titleId": "350"
    },
    {
      "id": "nx3vsloqt",
      "fromUserId": "4",
      "toUserId": "2",
      "timestamp": 1779139500027.9846,
      "type": "RECOMMENDED_TITLE",
      "message": "Klasika",
      "titleId": "1318447"
    },
    {
      "id": "2hc2k85mg",
      "fromUserId": "4",
      "toUserId": "2",
      "timestamp": 1779560053215.5374,
      "type": "SHARED_PLAYLIST",
      "message": "Koukni na tohle",
      "playlist": {
        "id": "pl-4-1",
        "name": "K zamyšlení",
        "titleIds": [
          "157336",
          "7451"
        ]
      }
    }
  ],
  "5": [
    {
      "id": "fs03r2e8y",
      "fromUserId": "2",
      "toUserId": "5",
      "timestamp": 1778973350299.327,
      "type": "RECOMMENDED_TITLE",
      "message": "Něco na víkend",
      "titleId": "1198994"
    },
    {
      "id": "8hq5tu0aa",
      "fromUserId": "5",
      "toUserId": "2",
      "timestamp": 1779415743112.35,
      "type": "RECOMMENDED_TITLE",
      "message": "Super film",
      "titleId": "1330021"
    },
    {
      "id": "e7acg8twx",
      "fromUserId": "5",
      "toUserId": "2",
      "timestamp": 1779066179253.629,
      "type": "SHARED_PLAYLIST",
      "message": "Dobrá klasika",
      "playlist": {
        "id": "pl-5-1",
        "name": "Stará klasika",
        "titleIds": [
          "278",
          "24428"
        ]
      }
    }
  ]
};
export const INITIAL_NOTIFICATIONS: Record<string, Notification[]> = {
  "2": [
    {
      "id": "notif-test-1",
      "type": "FRIEND_REQUEST",
      "fromUserId": "5",
      "timestamp": 1780094077094
    }
  ],
  "5": [
    {
      "id": "notif-test-2",
      "type": "FRIEND_REQUEST",
      "fromUserId": "2",
      "timestamp": 1780094127094
    }
  ]
};


