import React from 'react'
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { formatOrganizationName, mobileWorkboard } from '../../../packages/shared/src'

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f6fb'
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16
  },
  hero: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 8
  },
  eyebrow: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#162033'
  },
  description: {
    color: '#4f5f78',
    fontSize: 15,
    lineHeight: 22
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: 18,
    gap: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#162033'
  },
  row: {
    borderRadius: 16,
    backgroundColor: '#f8fbff',
    padding: 14,
    gap: 4
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#162033'
  },
  rowDescription: {
    color: '#4f5f78',
    fontSize: 14,
    lineHeight: 20
  }
})

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Mobile Workboard</Text>
          <Text style={styles.title}>{formatOrganizationName('tenant-demo')}</Text>
          <Text style={styles.description}>
            Review priorities, approvals, alerts, and quick operational actions from the same shared product architecture used on the web.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Primary mobile modules</Text>
          {mobileWorkboard.primaryModules.map((module) => (
            <View key={module.key} style={styles.row}>
              <Text style={styles.rowTitle}>{module.label}</Text>
              <Text style={styles.rowDescription}>{module.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          {mobileWorkboard.quickActions.map((action) => (
            <View key={action} style={styles.row}>
              <Text style={styles.rowTitle}>{action}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
