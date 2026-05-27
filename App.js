import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';

export default function App() {

  const [showSplash, setShowSplash] =
    useState(true);

  const fadeAnim =
    useRef(new Animated.Value(0)).current;

  const [screen, setScreen] =
    useState('home');

  const [xp, setXp] = useState(2450);

  const [level, setLevel] =
    useState(18);

  const [bodyweight, setBodyweight] =
    useState('75');

  const [bench, setBench] =
    useState('100');

  const [squat, setSquat] =
    useState('140');

  const [deadlift, setDeadlift] =
    useState('180');

  const [goalText, setGoalText] =
    useState('');

  const [selectedDay, setSelectedDay] =
    useState(null);

  const [calendarGoal, setCalendarGoal] =
    useState('');

  const [calendarGoals, setCalendarGoals] =
    useState({});

  const [bossFightText, setBossFightText] =
    useState('');

  const [bossFights, setBossFights] =
    useState([]);

  const [history, setHistory] =
    useState([]);

  const [dailyTimer, setDailyTimer] =
    useState('');

  const [weeklyTimer, setWeeklyTimer] =
    useState('');

  const [quests, setQuests] =
    useState([
      {
        title: 'Back + Abs Workout',
        reward: 120,
        done: false,
      },

      {
        title: 'Read 30 Minutes',
        reward: 60,
        done: false,
      },

      {
        title: '180g Protein Intake',
        reward: 90,
        done: false,
      },

      {
        title: 'Technical Study',
        reward: 100,
        done: false,
      },

      {
        title: 'Sleep Before 11 PM',
        reward: 70,
        done: false,
      },
    ]);

  useEffect(() => {

    Animated.sequence([

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),

    ]).start();

    setTimeout(() => {
      setShowSplash(false);
    }, 2500);

  }, []);

  useEffect(() => {

    const interval =
      setInterval(() => {

        const now =
          new Date();

        const midnight =
          new Date();

        midnight.setHours(
          24,
          0,
          0,
          0
        );

        const diff =
          midnight - now;

        const hours =
          Math.floor(
            diff /
              (1000 * 60 * 60)
          );

        const minutes =
          Math.floor(
            (
              diff %
                (1000 * 60 * 60)
            ) /
              (1000 * 60)
          );

        const seconds =
          Math.floor(
            (
              diff %
                (1000 * 60)
            ) / 1000
          );

        setDailyTimer(
          `${hours}h ${minutes}m ${seconds}s`
        );

      }, 1000);

    return () =>
      clearInterval(interval);

  }, []);

  useEffect(() => {

    if (
      bossFights.length === 0
    ) return;

    const latestBoss =
      bossFights[
        bossFights.length - 1
      ];

    const interval =
      setInterval(() => {

        const now =
          new Date();

        const end =
          new Date(
            latestBoss.expiresAt
          );

        const diff =
          end - now;

        if (diff <= 0) {

          setWeeklyTimer(
            'Expired'
          );

          return;
        }

        const days =
          Math.floor(
            diff /
              (1000 *
                60 *
                60 *
                24)
          );

        const hours =
          Math.floor(
            (
              diff %
                (1000 *
                  60 *
                  60 *
                  24)
            ) /
              (1000 *
                60 *
                60)
          );

        const minutes =
          Math.floor(
            (
              diff %
                (1000 *
                  60 *
                  60)
            ) /
              (1000 * 60)
          );

        setWeeklyTimer(
          `${days}d ${hours}h ${minutes}m`
        );

      }, 1000);

    return () =>
      clearInterval(interval);

  }, [bossFights]);

  const analysis =
    useMemo(() => {

      const bw =
        Number(bodyweight || 1);

      const benchRatio =
        Number(bench || 0) / bw;

      const squatRatio =
        Number(squat || 0) / bw;

      const deadliftRatio =
        Number(deadlift || 0) / bw;

      const total =
        benchRatio +
        squatRatio +
        deadliftRatio;

      let rank = 'D-RANK';

      if (total >= 4)
        rank = 'C-RANK';

      if (total >= 5)
        rank = 'B-RANK';

      if (total >= 6)
        rank = 'A-RANK';

      if (total >= 7)
        rank = 'S-RANK';

      if (total >= 8)
        rank =
          'SHADOW MONARCH';

      if (total >= 9)
        rank =
          'KING MONARCH';

      return {

        benchRatio:
          benchRatio.toFixed(2),

        squatRatio:
          squatRatio.toFixed(2),

        deadliftRatio:
          deadliftRatio.toFixed(2),

        total:
          total.toFixed(2),

        rank,

      };

    }, [
      bench,
      squat,
      deadlift,
      bodyweight,
    ]);

  const completeQuest =
    (index) => {

      const updated =
        [...quests];

      if (!updated[index].done) {

        updated[index].done =
          true;

        const gainedXP =
          updated[index].reward;

        const newXP =
          xp + gainedXP;

        setXp(newXP);

        setHistory([
          ...history,
          `Completed: ${updated[index].title} (+${gainedXP} XP)`
        ]);

        if (
          newXP >=
          level * 250
        ) {
          setLevel(level + 1);
        }
      }

      setQuests(updated);
    };

  const removeQuest =
    (index) => {

      const updated =
        [...quests];

      updated.splice(index, 1);

      setQuests(updated);
    };

  const addQuest = () => {

    if (
      !goalText.trim()
    ) return;

    setQuests([
      ...quests,

      {
        title: goalText,
        reward: 50,
        done: false,
      },
    ]);

    setGoalText('');
  };

  const addCalendarGoal =
    () => {

      if (
        !selectedDay ||
        !calendarGoal.trim()
      ) return;

      setCalendarGoals({

        ...calendarGoals,

        [selectedDay]: [
          ...(calendarGoals[
            selectedDay
          ] || []),

          calendarGoal,
        ],
      });

      setCalendarGoal('');
    };

  const addBossFight =
    () => {

      if (
        !bossFightText.trim()
      ) return;

      const now =
        new Date();

      const weekLater =
        new Date();

      weekLater.setDate(
        now.getDate() + 7
      );

      setBossFights([
        ...bossFights,

        {
          title:
            bossFightText,

          reward: 500,

          done: false,

          expiresAt:
            weekLater,
        },
      ]);

      setBossFightText('');
    };

  const completeBossFight =
    (index) => {

      const updated =
        [...bossFights];

      if (
        !updated[index].done
      ) {

        updated[index].done =
          true;

        const gainedXP =
          updated[index].reward;

        const newXP =
          xp + gainedXP;

        setXp(newXP);

        setHistory([
          ...history,
          `Boss Fight Completed: ${updated[index].title} (+${gainedXP} XP)`
        ]);

        if (
          newXP >=
          level * 250
        ) {
          setLevel(level + 1);
        }
      }

      setBossFights(updated);
    };

  const monthName =
    new Date().toLocaleString(
      'default',
      {
        month: 'long',
      }
    );

  const currentYear =
    new Date().getFullYear();

  const days =
    Array.from(
      { length: 31 },
      (_, i) => i + 1
    );

  if (showSplash) {

    return (

      <View
        style={
          styles.splashContainer
        }
      >

        <Animated.View
          style={{
            opacity: fadeAnim,
          }}
        >

          <Text
            style={
              styles.splashTitle
            }
          >
            GOD-MODE
          </Text>

          <Text
            style={
              styles.splashSub
            }
          >
            Welcome for leveling up
          </Text>

        </Animated.View>

      </View>
    );
  }

  const HomeScreen =
    () => (

      <ScrollView>

        <View
          style={
            styles.heroCard
          }
        >

          <Text
            style={
              styles.smallText
            }
          >
            GOD-MODE SYSTEM
          </Text>

          <Text
            style={
              styles.heroTitle
            }
          >
            LEVEL {level}
          </Text>

          <Text
            style={
              styles.heroSub
            }
          >
            {xp} XP
          </Text>

          <Text
            style={
              styles.rankDisplay
            }
          >
            {analysis.rank}
          </Text>

        </View>

        <View
          style={
            styles.grid
          }
        >

          <TouchableOpacity
            style={
              styles.navCard
            }
            onPress={() =>
              setScreen(
                'analyze'
              )
            }
          >

            <Text
              style={
                styles.navText
              }
            >
              Analyze
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.navCard
            }
            onPress={() =>
              setScreen(
                'quests'
              )
            }
          >

            <Text
              style={
                styles.navText
              }
            >
              Daily Quests
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.navCard
            }
            onPress={() =>
              setScreen(
                'calendar'
              )
            }
          >

            <Text
              style={
                styles.navText
              }
            >
              Calendar
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.navCard
            }
            onPress={() =>
              setScreen(
                'boss'
              )
            }
          >

            <Text
              style={
                styles.navText
              }
            >
              Boss Fight
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.navCard
            }
            onPress={() =>
              setScreen(
                'history'
              )
            }
          >

            <Text
              style={
                styles.navText
              }
            >
              History
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>
    );

  const AnalyzeScreen =
    () => (

      <ScrollView>

        <Text
          style={
            styles.sectionTitle
          }
        >
          STRENGTH ANALYSIS
        </Text>

        <View
          style={
            styles.card
          }
        >

          <Text
            style={
              styles.inputLabel
            }
          >
            Body Weight (kg)
          </Text>

          <TextInput
            style={
              styles.input
            }
            placeholder='Enter body weight'
            placeholderTextColor='#6B7280'
            keyboardType='numeric'
            value={
              bodyweight
            }
            onChangeText={
              setBodyweight
            }
          />

          <Text
            style={
              styles.inputLabel
            }
          >
            Bench Press 1RM (kg)
          </Text>

          <TextInput
            style={
              styles.input
            }
            placeholder='Enter bench press'
            placeholderTextColor='#6B7280'
            keyboardType='numeric'
            value={bench}
            onChangeText={
              setBench
            }
          />

          <Text
            style={
              styles.inputLabel
            }
          >
            Squat 1RM (kg)
          </Text>

          <TextInput
            style={
              styles.input
            }
            placeholder='Enter squat'
            placeholderTextColor='#6B7280'
            keyboardType='numeric'
            value={squat}
            onChangeText={
              setSquat
            }
          />

          <Text
            style={
              styles.inputLabel
            }
          >
            Deadlift 1RM (kg)
          </Text>

          <TextInput
            style={
              styles.input
            }
            placeholder='Enter deadlift'
            placeholderTextColor='#6B7280'
            keyboardType='numeric'
            value={
              deadlift
            }
            onChangeText={
              setDeadlift
            }
          />

          <Text
            style={
              styles.analysisText
            }
          >
            Bench Ratio:
            {' '}
            {
              analysis.benchRatio
            }x
          </Text>

          <Text
            style={
              styles.analysisText
            }
          >
            Squat Ratio:
            {' '}
            {
              analysis.squatRatio
            }x
          </Text>

          <Text
            style={
              styles.analysisText
            }
          >
            Deadlift Ratio:
            {' '}
            {
              analysis.deadliftRatio
            }x
          </Text>

          <Text
            style={
              styles.analysisText
            }
          >
            Total Power:
            {' '}
            {
              analysis.total
            }
          </Text>

          <Text
            style={
              styles.rankText
            }
          >
            {
              analysis.rank
            }
          </Text>

        </View>

      </ScrollView>
    );

  const QuestScreen =
    () => (

      <ScrollView>

        <Text
          style={
            styles.sectionTitle
          }
        >
          DAILY QUESTS
        </Text>

        <View
          style={
            styles.timerBox
          }
        >

          <Text
            style={
              styles.timerTitle
            }
          >
            DAILY RESET
          </Text>

          <Text
            style={
              styles.timerText
            }
          >
            {dailyTimer}
          </Text>

        </View>

        <View
          style={
            styles.addRow
          }
        >

          <TextInput
            style={
              styles.addInput
            }
            placeholder='Add Quest'
            placeholderTextColor='#6B7280'
            value={goalText}
            onChangeText={
              setGoalText
            }
          />

          <TouchableOpacity
            style={
              styles.addButton
            }
            onPress={
              addQuest
            }
          >

            <Text
              style={
                styles.buttonText
              }
            >
              ADD
            </Text>

          </TouchableOpacity>

        </View>

        {
          quests.map(
            (
              quest,
              index
            ) => (

              <View
                key={index}
                style={
                  styles.questCard
                }
              >

                <View>

                  <Text
                    style={[
                      styles.questTitle,

                      quest.done &&
                        styles.completedText,
                    ]}
                  >
                    {
                      quest.title
                    }
                  </Text>

                  <Text
                    style={
                      styles.rewardText
                    }
                  >
                    +
                    {
                      quest.reward
                    }
                    XP
                  </Text>

                </View>

                <View
                  style={{
                    flexDirection:
                      'row',
                  }}
                >

                  <TouchableOpacity
                    style={[
                      styles.completeButton,

                      quest.done &&
                        styles.doneButton,
                    ]}
                    onPress={() =>
                      completeQuest(
                        index
                      )
                    }
                  >

                    <Text
                      style={
                        styles.buttonText
                      }
                    >
                      {
                        quest.done
                          ? 'DONE'
                          : 'COMPLETE'
                      }
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      styles.removeButton
                    }
                    onPress={() =>
                      removeQuest(
                        index
                      )
                    }
                  >

                    <Text
                      style={
                        styles.buttonText
                      }
                    >
                      REMOVE
                    </Text>

                  </TouchableOpacity>

                </View>

              </View>

            )
          )
        }

      </ScrollView>
    );

  const CalendarScreen =
    () => (

      <ScrollView>

        <Text
          style={
            styles.sectionTitle
          }
        >
          CALENDAR
        </Text>

        <View
          style={
            styles.card
          }
        >

          <Text
            style={
              styles.monthText
            }
          >
            {monthName}
            {' '}
            {currentYear}
          </Text>

          <View
            style={
              styles.calendarGrid
            }
          >

            {
              days.map(
                (
                  day
                ) => (

                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayBox,

                      selectedDay ===
                        day &&
                        styles.selectedDay,
                    ]}
                    onPress={() =>
                      setSelectedDay(
                        day
                      )
                    }
                  >

                    <Text
                      style={
                        styles.dayText
                      }
                    >
                      {day}
                    </Text>

                  </TouchableOpacity>

                )
              )
            }

          </View>

          {
            selectedDay && (

              <>
                <TextInput
                  style={
                    styles.input
                  }
                  placeholder='Add Goal'
                  placeholderTextColor='#6B7280'
                  value={
                    calendarGoal
                  }
                  onChangeText={
                    setCalendarGoal
                  }
                />

                <TouchableOpacity
                  style={
                    styles.addButton
                  }
                  onPress={
                    addCalendarGoal
                  }
                >

                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    SAVE GOAL
                  </Text>

                </TouchableOpacity>

                {
                  (
                    calendarGoals[
                      selectedDay
                    ] || []
                  ).map(
                    (
                      goal,
                      index
                    ) => (

                      <Text
                        key={index}
                        style={
                          styles.analysisText
                        }
                      >
                        • {goal}
                      </Text>

                    )
                  )
                }

              </>
            )
          }

        </View>

      </ScrollView>
    );

  const BossScreen =
    () => (

      <ScrollView>

        <Text
          style={
            styles.sectionTitle
          }
        >
          WEEKLY BOSS FIGHT
        </Text>

        <View
          style={
            styles.timerBox
          }
        >

          <Text
            style={
              styles.timerTitle
            }
          >
            WEEKLY DEADLINE
          </Text>

          <Text
            style={
              styles.timerText
            }
          >
            {
              weeklyTimer ||
              'No Active Boss Fight'
            }
          </Text>

        </View>

        <View
          style={
            styles.addRow
          }
        >

          <TextInput
            style={
              styles.addInput
            }
            placeholder='Add Boss Fight'
            placeholderTextColor='#6B7280'
            value={
              bossFightText
            }
            onChangeText={
              setBossFightText
            }
          />

          <TouchableOpacity
            style={
              styles.addButton
            }
            onPress={
              addBossFight
            }
          >

            <Text
              style={
                styles.buttonText
              }
            >
              ADD
            </Text>

          </TouchableOpacity>

        </View>

        {
          bossFights.map(
            (
              boss,
              index
            ) => (

              <View
                key={index}
                style={
                  styles.questCard
                }
              >

                <View>

                  <Text
                    style={[
                      styles.questTitle,

                      boss.done &&
                        styles.completedText,
                    ]}
                  >
                    {
                      boss.title
                    }
                  </Text>

                  <Text
                    style={
                      styles.rewardText
                    }
                  >
                    +
                    {
                      boss.reward
                    }
                    XP
                  </Text>

                </View>

                <TouchableOpacity
                  style={[
                    styles.completeButton,

                    boss.done &&
                      styles.doneButton,
                  ]}
                  onPress={() =>
                    completeBossFight(
                      index
                    )
                  }
                >

                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    {
                      boss.done
                        ? 'DONE'
                        : 'COMPLETE'
                    }
                  </Text>

                </TouchableOpacity>

              </View>

            )
          )
        }

      </ScrollView>
    );

  const HistoryScreen =
    () => (

      <ScrollView>

        <Text
          style={
            styles.sectionTitle
          }
        >
          HISTORY
        </Text>

        <View
          style={
            styles.card
          }
        >

          {
            history.length ===
            0 ? (

              <Text
                style={
                  styles.analysisText
                }
              >
                No history yet
              </Text>

            ) : (

              history.map(
                (
                  item,
                  index
                ) => (

                  <Text
                    key={index}
                    style={
                      styles.analysisText
                    }
                  >
                    • {item}
                  </Text>

                )
              )

            )
          }

        </View>

      </ScrollView>
    );

  const renderScreen =
    () => {

      switch (
        screen
      ) {

        case 'analyze':
          return (
            <AnalyzeScreen />
          );

        case 'quests':
          return (
            <QuestScreen />
          );

        case 'calendar':
          return (
            <CalendarScreen />
          );

        case 'boss':
          return (
            <BossScreen />
          );

        case 'history':
          return (
            <HistoryScreen />
          );

        default:
          return (
            <HomeScreen />
          );
      }
    };

  return (

    <SafeAreaView
      style={
        styles.container
      }
    >

      <StatusBar
        barStyle='light-content'
      />

      <View
        style={
          styles.topBar
        }
      >

        {
          screen !==
            'home' && (

            <TouchableOpacity
              onPress={() =>
                setScreen(
                  'home'
                )
              }
            >

              <Text
                style={
                  styles.backText
                }
              >
                ← Back
              </Text>

            </TouchableOpacity>

          )
        }

      </View>

      {renderScreen()}

    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        '#0A0A0A',
      paddingHorizontal: 18,
    },

    splashContainer: {
      flex: 1,
      backgroundColor:
        '#0A0A0A',
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    splashTitle: {
      color: 'white',
      fontSize: 48,
      fontWeight: '900',
      letterSpacing: 4,
    },

    splashSub: {
      color: '#9CA3AF',
      marginTop: 20,
      fontSize: 16,
    },

    heroCard: {
      backgroundColor:
        '#111111',
      borderRadius: 28,
      padding: 24,
      marginTop: 20,
    },

    smallText: {
      color: '#9CA3AF',
      fontSize: 12,
      letterSpacing: 3,
    },

    heroTitle: {
      color: 'white',
      fontSize: 42,
      fontWeight: '900',
      marginTop: 10,
    },

    heroSub: {
      color: '#D1D5DB',
      fontSize: 18,
      marginTop: 10,
    },

    rankDisplay: {
      color: 'white',
      fontSize: 22,
      marginTop: 20,
      fontWeight: 'bold',
    },

    grid: {
      flexDirection:
        'row',
      flexWrap: 'wrap',
      justifyContent:
        'space-between',
      marginTop: 20,
    },

    navCard: {
      width: '48%',
      backgroundColor:
        '#111111',
      borderRadius: 24,
      paddingVertical: 40,
      alignItems:
        'center',
      marginBottom: 16,
    },

    navText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '700',
    },

    sectionTitle: {
      color: 'white',
      fontSize: 28,
      fontWeight: '900',
      marginTop: 20,
      marginBottom: 20,
    },

    card: {
      backgroundColor:
        '#111111',
      borderRadius: 24,
      padding: 20,
    },

    input: {
      backgroundColor:
        '#1A1A1A',
      borderRadius: 14,
      padding: 14,
      color: 'white',
      marginBottom: 14,
    },

    inputLabel: {
      color: '#9CA3AF',
      marginBottom: 8,
      marginTop: 8,
      fontSize: 14,
      fontWeight: '600',
    },

    analysisText: {
      color: '#D1D5DB',
      fontSize: 16,
      marginBottom: 10,
      marginTop: 10,
    },

    rankText: {
      color: 'white',
      fontSize: 28,
      fontWeight: '900',
      marginTop: 16,
    },

    addRow: {
      flexDirection:
        'row',
      marginBottom: 20,
    },

    addInput: {
      flex: 1,
      backgroundColor:
        '#111111',
      borderRadius: 16,
      padding: 16,
      color: 'white',
      marginRight: 10,
    },

    addButton: {
      backgroundColor:
        '#374151',
      paddingHorizontal: 20,
      justifyContent:
        'center',
      borderRadius: 16,
      paddingVertical: 16,
      alignItems:
        'center',
    },

    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },

    questCard: {
      backgroundColor:
        '#111111',
      borderRadius: 24,
      padding: 18,
      marginBottom: 14,
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
    },

    questTitle: {
      color: 'white',
      fontSize: 16,
      fontWeight: '700',
    },

    rewardText: {
      color: '#9CA3AF',
      marginTop: 8,
    },

    completeButton: {
      backgroundColor:
        '#374151',
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderRadius: 16,
      marginRight: 8,
    },

    removeButton: {
      backgroundColor:
        '#7F1D1D',
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderRadius: 16,
    },

    completedText: {
      textDecorationLine:
        'line-through',
      color: '#6B7280',
    },

    doneButton: {
      backgroundColor:
        '#14532D',
    },

    calendarGrid: {
      flexDirection:
        'row',
      flexWrap: 'wrap',
      justifyContent:
        'space-between',
    },

    dayBox: {
      width: '13%',
      aspectRatio: 1,
      backgroundColor:
        '#1A1A1A',
      borderRadius: 10,
      justifyContent:
        'center',
      alignItems:
        'center',
      marginBottom: 10,
    },

    selectedDay: {
      backgroundColor:
        '#374151',
    },

    dayText: {
      color: 'white',
      fontWeight: 'bold',
    },

    monthText: {
      color: 'white',
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
    },

    timerBox: {
      backgroundColor:
        '#111111',
      borderRadius: 24,
      padding: 20,
      alignItems:
        'center',
      marginBottom: 20,
    },

    timerTitle: {
      color: '#9CA3AF',
      fontSize: 14,
      letterSpacing: 2,
      marginBottom: 10,
    },

    timerText: {
      color: 'white',
      fontSize: 28,
      fontWeight: '900',
    },

    topBar: {
      paddingTop: 10,
      paddingBottom: 10,
    },

    backText: {
      color: 'white',
      fontSize: 16,
    },

  });