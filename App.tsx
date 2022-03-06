/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import ParsedText from 'react-native-parsed-text';
import LinearGradient from 'react-native-linear-gradient';

const App = () => {
  const [option, setOption]: any = useState(null);
  const [assigmentList, setAssigmentList]: any[] = useState([]);
  const [questionIndex, setQuestionIndex]: any = useState(0);
  const [screen, setScreen]: any = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect]: any = useState(false);


  let englishSentence = assigmentList[questionIndex]?.engWord.sentence || "";
  let englishKey = assigmentList[questionIndex]?.engWord.key || " ";
  let germanSentence = assigmentList[questionIndex]?.germanWord.sentence || "";
  let germanKey = assigmentList[questionIndex]?.germanWord.key || " ";


  useEffect(() => {
    const subscriber = firestore()
      .collection('assignment')
      .doc("mbEkt1BT8oC2XUE6VeET")
      .onSnapshot(querySnapshot => {
        const {data}:any = querySnapshot.data()
  
        setAssigmentList(data);
      });
  
    return () => subscriber();
  }, []);
  



  const germanText = (i: number) => {
    const {optionBackgroundColor, textColor} = germanTextCustomStyles();

    return (<View style={[styles.selectedOption, {backgroundColor: optionBackgroundColor}]} key={i}>
              <Text style={[styles.optionText, {color: textColor}]}>{option}</Text>
            </View>);
  }

  const germanTextCustomStyles = () => {
    if (isAnswerCorrect && screen === 1) {
      return {optionBackgroundColor: "#05e0e8", textColor: "white"}
    }
    else if (!isAnswerCorrect && screen === 1) {
      return {optionBackgroundColor: "#fe7989", textColor: "white"}
    }
    else {
      return {optionBackgroundColor: "white", textColor: "#3b6d81"}
    }
  }

  // colorOne: "#fe7989", colorTwo: "#fd918b", 
  const parseText = () => {
    var germanParts = germanSentence.split(/(\s+)/);
    const index = germanParts.indexOf(germanKey);
    console.log("germanParts", germanParts)

    
    // for (var i = 1; i < germanParts.length; i += 2) {
    //   // germanParts[i] = germanText(i, germanParts);
    //   console.log("i=", i, "germanParts.length=", germanParts.length, `germanParts[0]=${germanParts[1]}`)
    // }
    
    germanParts.splice(index, 1, germanText(1));
    return <Text style={styles.fillUpText}>{germanParts}</Text>;
    
  }

  // Option Button
  const optionButton = ({ item }) => {
    const {shadow, optionBackgroundColor, textColor, optionDisabled} = optionButtonCustomStyle(item);
    return (
      <Pressable 
        style={[styles.fillUpButton, {backgroundColor: optionBackgroundColor, ...getElevationStyle(shadow)}]} 
        onPress={() => setOption(item)}
        disabled={optionDisabled}
      >
        <View>
          <Text style={[styles.optionText, {color: textColor}]}>{item}</Text>
        </View>
      </Pressable>
    )
  }

  // Option Button Styles
  const optionButtonCustomStyle = (value:any) => {
    if (option === value) {
      return {shadow: 0, optionBackgroundColor: "#6392a6", textColor: "#6392a6", optionDisabled: false}
    }
    else if (screen === 1) {
      return {shadow: 9, optionBackgroundColor: "#9fb4c1", textColor: "#67828f", optionDisabled: true}
    }
    else {
      return {shadow: 9, optionBackgroundColor: "white", textColor: "#3b6d81", optionDisabled: false}
    }
  }


  const button = () => {
    const {shadow, buttonBackgroundColor, buttonText, textColor} = buttonCustomStyle();
    return (
        <Pressable 
          style={[
            styles.button, 
            screen === 0 && {position: "absolute", bottom: 40},
            {
              backgroundColor: buttonBackgroundColor, 
              ...getElevationStyle(shadow), 
            },
          ]}
          onPress={() => {
            // if (option === null) {
            //   Alert.alert("Please choose the option")
            // } else {
            //   validateAnswer();
            // }
            buttonOptions()
          }}
        >
            <Text style={[styles.buttonText, {color: textColor}]}>{buttonText}</Text>
        </Pressable>
    )
  }

  const buttonOptions = () => {
    if (option === null) {
      Alert.alert("Please choose the option")
    }
    else if (screen === 1) {
      nextQuestion();
    }
    else {
      validateAnswer();
    }
  }

  const validateAnswer = () => {
    if (option === germanKey) {
      setScreen(1);
      setIsAnswerCorrect(true);
    }
    else {
      setScreen(1);
      setIsAnswerCorrect(false);
    }
  }

  const nextQuestion = () => {
    if (questionIndex < (assigmentList.length - 1)) {
      setQuestionIndex(questionIndex + 1);
      setScreen(0);
      setOption(null);
    }
    else {
      Alert.alert("Exercise Completed")
    }
  }


  const buttonCustomStyle = () => {
    if (option === null) {
      return {shadow: 0, buttonBackgroundColor: "#6392a6", buttonText: "CONTINUE", textColor: "white"}
    }
    else if (option != null && screen === 0) {
      return {shadow: 6, buttonBackgroundColor: "#2ae6eb", buttonText: "CHECK ANSWER", textColor: "white"}
    }
    else if (screen === 1 && isAnswerCorrect) {
      return {shadow: 6, buttonBackgroundColor: "white", buttonText: "CONTINUE", textColor: "#2ae6eb"}
    }
    else if (screen === 1 && !isAnswerCorrect) {
      return {shadow: 6, buttonBackgroundColor: "white", buttonText: "CONTINUE", textColor: "#fd7c85"}
    }
  }


  const buttonWrapper = () => {
      return (
        <LinearGradient 
          start={{x: 0, y: 0}} 
          end={{x: 1, y: 0}} 
          colors={isAnswerCorrect ? ['#06deea', '#3ce9e8'] : ['#fe7989', '#fd918b']} 
          style={styles.buttonWrapper}
        >
          <View>
            <View style={styles.buttonWrapperContent}>
              <Text style={styles.buttonWrapperText}>{isAnswerCorrect ? "Great Job!" : `Answer: ${germanKey}` }</Text>
              <Ionicons name="ios-flag-sharp" color="white" size={18} />
            </View>
            {button()}
          </View>
        </LinearGradient>
      )
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3b6d81" barStyle="light-content" />

      <View style={styles.assigmentSection}>
          {/* Header */}
          <Text style={styles.header}>Fill in the missing word</Text>

          {/* English Sentence */}
          <ParsedText
            style={styles.assigmentQuestion}
            parse={
              [
                {pattern: RegExp(englishKey), style: styles.highlightText},
              ]
            }
            childrenProps={{allowFontScaling: false}}
          >
           {englishSentence}
          </ParsedText>

          {/* German Sentence */}
          <View>
            {option === null && (
              <View>
                <View style={styles.tootip}>
                  <Text style={styles.toolTipText}>{englishSentence.split(" ", 1)}</Text>
                  <AntDesign name='caretdown' size={23} color="white" />
                </View>
                <Text style={styles.fillUpText}>{germanSentence.replace(germanKey, "_________") || ""}</Text>
              </View>
            )}

            {option != null && parseText()}
          </View>

          {/* Options */}
          <View style={{marginTop: 50}}>
            <View style={{flexDirection: "row"}}>
                <FlatList 
                  data={assigmentList[questionIndex]?.options || []}
                  renderItem={optionButton}
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                />
            </View>
          </View>
      </View>
      
      {/* Button */}
      {screen === 1 ? buttonWrapper() : button()}
    </SafeAreaView>
  );
};

// Shadow Generator
const getElevationStyle = (elevation:number):any => {
  return {
      elevation,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0.5 * elevation },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3b6d81",
    flex: 1,
  },
  assigmentSection: {
    margin: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    color: 'white',
    alignSelf: 'center',
    fontWeight: '300',
    letterSpacing: 0.4,
    fontSize: 13
  },
  assigmentQuestion: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 25,
    marginVertical: 30,
  },
  highlightText: {
    textDecorationLine: 'underline',
    fontWeight: "600",
    letterSpacing: 1
  },
  tootip: {
    backgroundColor: 'white',
    borderRadius: 9,
    width: 60,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    marginLeft: -15,
  },
  toolTipText: {
    marginTop: 20,
    color: "#3b6d81",
    fontWeight: '600',
  },
  fillUpText: {
    color: 'white',
    fontSize: 17,
  },
  selectedOption: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...getElevationStyle(9)
  },
  fillUpButton: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingHorizontal: "8%",
    paddingVertical: "5%",
    marginRight: 15,
  },
  optionText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: "#3b6d81",
  },
  button: {
    borderRadius: 30,
    width: '90%',
    height: 60,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    // fontWeight: "bold",
    fontWeight: "700"
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
    height: "25%"
  },
  buttonWrapperContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
    marginHorizontal: 25
  },
  buttonWrapperText: {
    color: "white",
    fontWeight: "bold"
  }
});

export default App;
