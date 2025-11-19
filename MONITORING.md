# Production Monitoring & Alerting Guide

This guide covers monitoring, logging, and alerting for the Modern Teletext production deployment.

## Table of Contents

1. [Firebase Console Overview](#firebase-console-overview)
2. [Performance Monitoring](#performance-monitoring)
3. [Analytics](#analytics)
4. [Error Tracking](#error-tracking)
5. [Cloud Functions Monitoring](#cloud-functions-monitoring)
6. [Firestore Monitoring](#firestore-monitoring)
7. [Alerting Configuration](#alerting-configuration)
8. [Logging](#logging)
9. [Cost Monitoring](#cost-monitoring)

---

## Firebase Console Overview

Access the Firebase Console at: https://console.firebase.google.com/project/teletext-eacd0

### Key Dashboards

1. **Overview**: High-level project metrics
2. **Analytics**: User engagement and behavior
3. **Performance**: Page load times and API latency
4. **Functions**: Cloud Functions execution metrics
5. **Firestore**: Database operations and usage
6. **Hosting**: Deployment history and traffic

---

## Performance Monitoring

### Accessing Performance Data

1. Go to Firebase Console → Performance
2. View metrics for:
   - Page load times
   - Network requests
   - Custom traces

### Key Metrics to Monitor

#### Page Load Performance

- **First Contentful Paint (FCP)**: Target < 1.5s
- **Largest Contentful Paint (LCP)**: Target < 2.5s
- **First Input Delay (FID)**: Target < 100ms
- **Cumulative Layout Shift (CLS)**: Target < 0.1
- **Time to Interactive (TTI)**: Target < 3.5s

#### Custom Traces

Our application includes custom traces for:

- `page_load_{pageId}`: Individual page load times
- `api_{endpoint}`: API call durations
- `navigation`: Navigation between pages
- `cache_hit`, `cache_miss`, `cache_set`: Cache operations

### Viewing Custom Traces

```typescript
// Custom traces are automatically tracked via lib/performance-traces.ts
import { tracePageLoad, traceAPICall } from '@/lib/performance-traces';

// Example: Trace a page load
await tracePageLoad('100', async () => {
  return fetchPage('100');
});
```

### Performance Alerts

Set up alerts for:

- **Slow page loads**: Alert if p95 > 3 seconds
- **API timeouts**: Alert if p95 > 1 second
- **High error rates**: Alert if error rate > 5%

---

## Analytics

### User Engagement Metrics

Track in Firebase Console → Analytics:

- **Active Users**: Daily, weekly, monthly
- **Session Duration**: Average time spent
- **Page Views**: Most popular pages
- **User Retention**: Return visitor rate
- **Engagement Rate**: Interactions per session

### Custom Events

Our application tracks:

- `page_view`: When a page is loaded
- `navigation`: When user navigates between pages
- `theme_change`: When user changes theme
- `ai_interaction`: When user interacts with AI Oracle
- `game_played`: When user plays a game
- `error_occurred`: When an error happens

### Viewing Analytics

```bash
# View analytics in Firebase Console
# Or use BigQuery for advanced analysis
```

### Key Questions to Answer

1. Which pages are most popular?
2. What is the average session duration?
3. How many users return after first visit?
4. What features are most used?
5. Where do users drop off?

---

## Error Tracking

### Client-Side Errors

Monitor browser console errors:

1. Go to Firebase Console → Crashlytics (if enabled)
2. Or use browser DevTools → Console

### Common Error Patterns

- **Network errors**: API unavailable, timeout
- **Navigation errors**: Invalid page number
- **Rendering errors**: Component crash
- **Cache errors**: Storage quota exceeded

### Error Logging

Errors are automatically logged to Firebase:

```typescript
// Errors are caught and logged in components
try {
  await fetchPage(pageId);
} catch (error) {
  console.error('Failed to fetch page:', error);
  // Error is automatically sent to Firebase
}
```

### Error Response Format

All API errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## Cloud Functions Monitoring

### Accessing Function Logs

```bash
# View all function logs
firebase functions:log

# View specific function
firebase functions:log --only getPage

# View logs with filter
firebase functions:log --only getPage --limit 100

# View logs in Cloud Console
gcloud logging read "resource.type=cloud_function" \
  --limit 50 \
  --project teletext-eacd0
```

### Key Metrics

Monitor in Firebase Console → Functions:

- **Invocations**: Number of function calls
- **Execution time**: Average and p95 duration
- **Memory usage**: Peak memory consumption
- **Error rate**: Percentage of failed invocations
- **Active instances**: Number of running instances

### Function Performance Targets

- **getPage**: < 500ms average, < 1s p95
- **processAI**: < 5s average, < 10s p95
- **deleteConversation**: < 200ms average

### Cold Start Optimization

Monitor cold start times:

- Target: < 1 second for cold starts
- Use min instances for critical functions (costs more)
- Optimize function size and dependencies

### Function Logs Structure

```typescript
// Logs include structured data
{
  severity: 'INFO' | 'WARNING' | 'ERROR',
  message: 'Request completed',
  pageId: '100',
  duration: 234,
  timestamp: '2024-01-01T00:00:00Z'
}
```

---

## Firestore Monitoring

### Accessing Firestore Metrics

Go to Firebase Console → Firestore → Usage

### Key Metrics

- **Document Reads**: Number of read operations
- **Document Writes**: Number of write operations
- **Document Deletes**: Number of delete operations
- **Storage Size**: Total data stored
- **Network Egress**: Data transferred out

### Cost Optimization

Monitor and optimize:

1. **Read Operations**
   - Use caching to reduce reads
   - Implement pagination
   - Avoid unnecessary queries

2. **Write Operations**
   - Batch writes when possible
   - Use TTL for automatic cleanup
   - Avoid redundant updates

3. **Storage**
   - Clean up old conversations (24h TTL)
   - Compress large documents
   - Archive historical data

### Firestore Queries to Monitor

```typescript
// Monitor these collections
- pages_cache: Should have high read, low write
- conversations: Should auto-expire after 24h
- user_preferences: Should have low read/write
- analytics: Should have moderate write
```

### Setting Up Alerts

Alert when:

- Daily reads > 1 million
- Daily writes > 100,000
- Storage > 10 GB
- Quota approaching limit (80%)

---

## Alerting Configuration

### Firebase Alerts

Configure in Firebase Console → Project Settings → Integrations

#### Performance Alerts

```yaml
Alert: Slow Page Load
Condition: p95 page load time > 3 seconds
Action: Email notification
Frequency: Immediate
```

```yaml
Alert: High Error Rate
Condition: Error rate > 5% over 5 minutes
Action: Email + Slack notification
Frequency: Immediate
```

#### Function Alerts

```yaml
Alert: Function Failures
Condition: Any function failure
Action: Email notification
Frequency: Immediate
```

```yaml
Alert: High Function Duration
Condition: p95 duration > 10 seconds
Action: Email notification
Frequency: Every 15 minutes
```

#### Quota Alerts

```yaml
Alert: Approaching Quota
Condition: Usage > 80% of quota
Action: Email notification
Frequency: Daily
```

### Cloud Monitoring Alerts

Set up in Google Cloud Console → Monitoring → Alerting

#### Example Alert Policy

```yaml
Name: High Function Error Rate
Condition:
  Metric: cloud.googleapis.com/functions/execution_count
  Filter: status != "ok"
  Threshold: > 10 errors in 5 minutes
Notification:
  Email: your-email@example.com
  Slack: #alerts-channel
```

### Slack Integration

1. Create Slack webhook URL
2. Add to Firebase Console → Integrations
3. Configure alert routing

### Email Notifications

Configure in Firebase Console:

1. Go to Project Settings → Integrations
2. Add email addresses for alerts
3. Set notification preferences

---

## Logging

### Log Levels

Our application uses structured logging:

- **DEBUG**: Detailed debugging information
- **INFO**: General informational messages
- **WARNING**: Warning messages for potential issues
- **ERROR**: Error messages for failures

### Viewing Logs

#### Firebase Console

1. Go to Functions → Logs
2. Filter by severity, function, or time range
3. Search for specific messages

#### Cloud Console

```bash
# View all logs
gcloud logging read --project teletext-eacd0 --limit 100

# Filter by severity
gcloud logging read "severity>=ERROR" --project teletext-eacd0

# Filter by function
gcloud logging read "resource.labels.function_name=getPage" --project teletext-eacd0

# Filter by time range
gcloud logging read --project teletext-eacd0 \
  --format="table(timestamp,severity,textPayload)" \
  --freshness=1h
```

### Log Retention

- **Firebase Console**: 30 days
- **Cloud Logging**: 30 days (default)
- **Long-term storage**: Export to BigQuery or Cloud Storage

### Exporting Logs

```bash
# Export logs to Cloud Storage
gcloud logging sinks create my-sink \
  storage.googleapis.com/my-logs-bucket \
  --log-filter='resource.type="cloud_function"'

# Export to BigQuery for analysis
gcloud logging sinks create my-bigquery-sink \
  bigquery.googleapis.com/projects/teletext-eacd0/datasets/logs \
  --log-filter='resource.type="cloud_function"'
```

---

## Cost Monitoring

### Accessing Cost Data

Go to Google Cloud Console → Billing → Reports

### Key Cost Drivers

1. **Cloud Functions**
   - Invocations
   - Compute time
   - Network egress

2. **Firestore**
   - Document reads
   - Document writes
   - Storage

3. **Hosting**
   - Bandwidth
   - Storage

4. **Vertex AI**
   - API calls
   - Token usage

### Cost Optimization Tips

1. **Caching**
   - Implement aggressive caching
   - Use CDN for static assets
   - Cache API responses

2. **Function Optimization**
   - Reduce cold starts
   - Optimize memory usage
   - Minimize dependencies

3. **Firestore Optimization**
   - Use pagination
   - Implement TTL policies
   - Batch operations

4. **Monitoring**
   - Set budget alerts
   - Review usage weekly
   - Identify cost anomalies

### Budget Alerts

Set up in Google Cloud Console → Billing → Budgets:

```yaml
Budget: Monthly Limit
Amount: $100
Alerts:
  - 50% of budget
  - 80% of budget
  - 100% of budget
Actions:
  - Email notification
  - Slack notification
```

### Cost Projections

Monitor trends:

- Daily cost
- Weekly cost
- Monthly projection
- Year-over-year comparison

---

## Dashboard Setup

### Custom Dashboard

Create a custom dashboard in Cloud Console → Monitoring → Dashboards

#### Recommended Widgets

1. **Function Invocations**
   - Metric: cloud.googleapis.com/functions/execution_count
   - Chart type: Line chart
   - Group by: function_name

2. **Function Duration**
   - Metric: cloud.googleapis.com/functions/execution_times
   - Chart type: Heatmap
   - Percentiles: p50, p95, p99

3. **Error Rate**
   - Metric: cloud.googleapis.com/functions/execution_count
   - Filter: status != "ok"
   - Chart type: Line chart

4. **Firestore Operations**
   - Metric: firestore.googleapis.com/document/read_count
   - Chart type: Stacked area
   - Group by: operation_type

5. **Page Load Times**
   - Metric: Custom trace data
   - Chart type: Distribution
   - Percentiles: p50, p95, p99

---

## Troubleshooting

### High Error Rate

1. Check function logs for error messages
2. Verify API keys are configured
3. Check external API status
4. Review recent deployments

### Slow Performance

1. Check Performance Monitoring dashboard
2. Identify slow pages or API calls
3. Review caching effectiveness
4. Check function cold starts

### High Costs

1. Review billing reports
2. Identify cost drivers
3. Check for runaway functions
4. Review Firestore usage

### Function Timeouts

1. Increase timeout in function config
2. Optimize API calls
3. Implement caching
4. Consider async processing

---

## Best Practices

1. **Monitor Regularly**: Check dashboards daily
2. **Set Up Alerts**: Configure alerts for critical metrics
3. **Review Logs**: Investigate errors promptly
4. **Optimize Costs**: Review usage weekly
5. **Test Alerts**: Verify alert notifications work
6. **Document Issues**: Keep a log of incidents
7. **Update Thresholds**: Adjust alerts as traffic grows

---

## Support Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Cloud Monitoring**: https://cloud.google.com/monitoring/docs
- **Firebase Support**: https://firebase.google.com/support
- **Stack Overflow**: Tag questions with `firebase`

---

**Last Updated**: [Date]
**Project**: Modern Teletext (teletext-eacd0)
