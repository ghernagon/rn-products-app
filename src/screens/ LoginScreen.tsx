import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Background} from '../components/Background';
import {Logo} from '../components/Logo';
import {loginStyles} from '../theme/loginTheme';

export const LoginScreen = () => {
  return (
    <>
      {/* Background */}
      <Background />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyles.formContainer}>
          {/* KeyboardAvoidView */}
          <Logo />
          <Text style={loginStyles.title}>Login</Text>

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
            // TODO: onchange, value
          />

          <Text style={loginStyles.label}>Password:</Text>
          <TextInput
            placeholder="Password"
            placeholderTextColor={'rgba(255,255,255,0.4)'}
            autoCorrect={false}
            autoCapitalize="none"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              Platform.OS === 'ios' && loginStyles.iosInputField,
            ]}
            selectionColor="white"
            // TODO: onchange, value
          />

          {/* Submit */}
          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={loginStyles.submitButton}>
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* New Account */}
          <View style={loginStyles.newAccountContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => console.log('click new account')}>
              <Text style={loginStyles.buttonText}>Create new account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
