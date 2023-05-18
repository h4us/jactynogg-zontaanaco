{
  "task_0": [
    {
      "name": "Set the obstacle avoididance type",
      "code": 10,
      "data": [
        {
          "label": "obstacle_avoididance_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Lock channel type": 33
            },
            {
              "Release channel selection": 34
            }
          ],
          "value": 33
        },
        {
          "label": "type_of_obstacle_avoididance",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Fork selection",
      "code": 4,
      "data": [
        {
          "label": "fork_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Turn left": 33
            },
            {
              "Turn right": 34
            },
            {
              "Go straight": 35
            },
            {
              "Turn 90deg anti-clockwise": 36
            },
            {
              "Turn 180deg anti-clockwise": 37
            },
            {
              "Turn 90deg clockwise": 38
            },
            {
              "Turn 180deg clockwise": 39
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": 99
        }
      ]
    }
  ],

  "task_1": [
    {
      "name": "Set the obstacle avoididance type",
      "code": 10,
      "data": [
        {
          "label": "obstacle_avoididance_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Lock channel type": 33
            },
            {
              "Release channel selection": 34
            }
          ],
          "value": 33
        },
        {
          "label": "type_of_obstacle_avoididance",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from %>
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 7
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 2
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay_short %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from %>
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 14
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 4
        }
      ]
    }
  ],

  "task_2": [
    {
      "name": "Set the obstacle avoididance type",
      "code": 10,
      "data": [
        {
          "label": "obstacle_avoididance_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Lock channel type": 33
            },
            {
              "Release channel selection": 34
            }
          ],
          "value": 33
        },
        {
          "label": "type_of_obstacle_avoididance",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from2 %>
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from2 %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to2 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 8
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to2 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 2
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay_short %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from2 %>
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from2 %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next2 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 14
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next2 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 4
        }
      ]
    }
  ],

  "task_3": [
    {
      "name": "Set the obstacle avoididance type",
      "code": 10,
      "data": [
        {
          "label": "obstacle_avoididance_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Lock channel type": 33
            },
            {
              "Release channel selection": 34
            }
          ],
          "value": 33
        },
        {
          "label": "type_of_obstacle_avoididance",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from3 %>
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from3 %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to3 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 7
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to3 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 2
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay_short %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next3 %>
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next3 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 4
        }
      ]
    }
  ],

  "task_4": [
    {
      "name": "Set the obstacle avoididance type",
      "code": 10,
      "data": [
        {
          "label": "obstacle_avoididance_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Lock channel type": 33
            },
            {
              "Release channel selection": 34
            }
          ],
          "value": 33
        },
        {
          "label": "type_of_obstacle_avoididance",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from4 %>
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from4 %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to4 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 9
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to4 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 2
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay %>
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from4 %>
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from4 %>
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": 3
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next4 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 10
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next4 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 4
        }
      ]
    }
  ],

  "task_5": [
    {
      "name": "Set the obstacle avoididance type",
      "code": 10,
      "data": [
        {
          "label": "obstacle_avoididance_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Lock channel type": 33
            },
            {
              "Release channel selection": 34
            }
          ],
          "value": 33
        },
        {
          "label": "type_of_obstacle_avoididance",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from %>
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 11
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 1
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay_short %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from %>
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 2
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay_short %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 14
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 4
        }
      ]
    }
  ],

  "task_6": [
    {
      "name": "Set the obstacle avoididance type",
      "code": 10,
      "data": [
        {
          "label": "obstacle_avoididance_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Lock channel type": 33
            },
            {
              "Release channel selection": 34
            }
          ],
          "value": 33
        },
        {
          "label": "type_of_obstacle_avoididance",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from2 %>
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from2 %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to2 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 12
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to2 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 1
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay_short %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from2 %>
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from2 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 2
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay_short %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next2 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 14
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next2 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 4
        }
      ]
    }
  ],

  "task_7": [
    {
      "name": "Set the obstacle avoididance type",
      "code": 10,
      "data": [
        {
          "label": "obstacle_avoididance_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Lock channel type": 33
            },
            {
              "Release channel selection": 34
            }
          ],
          "value": 33
        },
        {
          "label": "type_of_obstacle_avoididance",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from3 %>
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from3 %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to3 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 11
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to3 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 1
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay_short %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from3 %>
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from3 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 2
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay_short %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": "33"
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next3 %>
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next3 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 4
        }
      ]
    }
  ],

  "task_8": [
    {
      "name": "Set the obstacle avoididance type",
      "code": 10,
      "data": [
        {
          "label": "obstacle_avoididance_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Lock channel type": 33
            },
            {
              "Release channel selection": 34
            }
          ],
          "value": 33
        },
        {
          "label": "type_of_obstacle_avoididance",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 33
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from4 %>
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value":  <%= from4 %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value":  <%= to4 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 13
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= to4 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 1
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay %>
        }
      ]
    },
    {
      "name": "Set Direction",
      "code": 24,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Positive Direction": 33
            },
            {
              "Back": 34
            },
            {
              "Left": 35
            },
            {
              "Right": 36
            },
            {
              "Change direction": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Set speed level",
      "code": 5,
      "data": [
        {
          "label": "speed_level_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "System default": 33
            },
            {
              "Set speed level": 34
            }
          ],
          "value": 34
        },
        {
          "label": "speed_level",
          "type": "number",
          "value": 0
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from4 %>
        }
      ]
    },
    {
      "name": "Set control mode",
      "code": 6,
      "data": [
        {
          "label": "mode_setting",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Map control mode": 33
            },
            {
              "Track mode": 34
            },
            {
              "Free navi mode": 35
            },
            {
              "Force turn mode": 36
            }
          ],
          "value": 34
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= from4 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 2
        }
      ]
    },
    {
      "name": "Delay",
      "code": 12,
      "data": [
        {
          "label": "delay_time_seconds",
          "type": "number",
          "value": <%= delay %>
        }
      ]
    },
    {
      "name": "Navigation target",
      "code": 8,
      "data": [
        {
          "label": "navigation_action",
          "type": "select",
          "options": [
            {
              "No Action": 32
            },
            {
              "Update the target": 33
            },
            {
              "Cancel the navigation": 34
            }
          ],
          "value": 33
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next4 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 10
        }
      ]
    },
    {
      "name": "Navigation target in place",
      "code": 9,
      "data": [
        {
          "type": "constant",
          "value": 0
        },
        {
          "label": "target",
          "type": "number",
          "value": <%= next4 %>
        }
      ]
    },
    {
      "name": "Script calls",
      "code": 28,
      "data": [
        {
          "label": "function_name",
          "type": "number",
          "value": 4
        }
      ]
    }
  ],

  "task_9": []
}
