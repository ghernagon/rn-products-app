import {StyleSheet} from 'react-native';

export const loginStyles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    height: 600,
    marginBottom: 50,
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  label: {
    color: 'white',
    marginTop: 25,
    fontWeight: 'bold',
  },
  inputField: {
    color: 'white',
    fontSize: 20,
  },
  iosInputField: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    paddingBottom: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  submitButton: {
    borderWidth: 2,
    borderColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 100,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  newAccountContainer: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
});
