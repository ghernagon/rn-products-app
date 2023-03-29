import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Logo} from '../components/Logo';
import {AuthContext} from '../context/AuthContext';
import {useForm} from '../hooks/useForm';
import {loginStyles} from '../theme/loginTheme';

interface Props extends StackScreenProps<any, any> {}

export const RegisterScreen = ({navigation}: Props) => {
  const {name, email, password, onChange} = useForm({
    name: '',
    email: '',
    password: '',
  });

  const {signUp, errorMsg, removeError} = useContext(AuthContext);

  const onRegister = () => {
    Keyboard.dismiss();
    signUp({nombre: name, correo: email, password});
  };

  useEffect(() => {
    if (errorMsg.length === 0) return;
    Alert.alert('Register', errorMsg, [{text: 'Accept', onPress: removeError}]);
  }, [errorMsg]);

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyles.formContainer}>
          <Logo />
          <Text style={loginStyles.title}>Register</Text>

          <Text style={loginStyles.label}>Name:</Text>
          <TextInput
            placeholder="Name"
            placeholderTextColor={'rgba(255,255,255,0.4)'}
            autoCorrect={false}
            autoCapitalize="words"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.iosInputField,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'name')}
            value={name}
            onSubmitEditing={onRegister}
          />

          <Text style={loginStyles.label}>Email:</Text>
          <TextInput
            placeholder="Email address"
            placeholderTextColor={'rgba(255,255,255,0.4)'}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.iosInputField,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'email')}
            value={email}
            onSubmitEditing={onRegister}
          />

          <Text style={loginStyles.label}>Password:</Text>
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor={'rgba(255,255,255,0.4)'}
            autoCorrect={false}
            autoCapitalize="none"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.iosInputField,
            ]}
            selectionColor="white"
            onChangeText={value => onChange(value, 'password')}
            value={password}
            onSubmitEditing={onRegister}
          />

          {/* Submit */}
          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={loginStyles.submitButton}
              onPress={onRegister}>
              <Text style={loginStyles.buttonText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Login */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.replace('LoginScreen')}
            style={styles.fab}>
            <Text style={loginStyles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5856D6',
  },
  fab: {
    position: 'absolute',
    top: 50,
    left: 20,
    borderWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
});
