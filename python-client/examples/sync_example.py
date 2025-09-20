#!/usr/bin/env python3
"""
Example script demonstrating data synchronization with the School Management System API
"""

import json
import sys
import os
from datetime import datetime, timedelta
from school_api_client import SchoolAPIClient, BatchProcessor, SchoolAPIError

# Configuration
API_BASE_URL = os.getenv("SCHOOL_API_BASE_URL", "http://localhost:5000")
CLIENT_ID = os.getenv("SCHOOL_API_CLIENT_ID", "your_client_id")
CLIENT_SECRET = os.getenv("SCHOOL_API_CLIENT_SECRET", "your_client_secret")
USERNAME = os.getenv("SCHOOL_API_USERNAME", "admin@example.com")
PASSWORD = os.getenv("SCHOOL_API_PASSWORD", "password")

def load_sample_data():
    """Load sample data for demonstration"""
    return {
        "students": [
            {
                "firstName": "Ahmed",
                "lastName": "Mohammed",
                "email": "ahmed.mohammed@school.com",
                "rollNumber": "SMS2024001",
                "dateOfBirth": "2008-03-15",
                "gender": "male",
                "phoneNumber": "+2348012345678",
                "address": "123 Main Street, Lagos"
            },
            {
                "firstName": "Fatima",
                "lastName": "Abubakar",
                "email": "fatima.abubakar@school.com",
                "rollNumber": "SMS2024002",
                "dateOfBirth": "2008-07-22",
                "gender": "female",
                "phoneNumber": "+2348012345679",
                "address": "456 Oak Avenue, Abuja"
            },
            {
                "firstName": "Ibrahim",
                "lastName": "Yusuf",
                "email": "ibrahim.yusuf@school.com",
                "rollNumber": "SMS2024003",
                "dateOfBirth": "2008-11-08",
                "gender": "male",
                "phoneNumber": "+2348012345680",
                "address": "789 Pine Road, Kano"
            }
        ],
        "attendance": [
            {
                "studentRollNumber": "SMS2024001",
                "date": "2024-01-15",
                "status": "present",
                "remarks": "On time"
            },
            {
                "studentRollNumber": "SMS2024002",
                "date": "2024-01-15",
                "status": "present",
                "remarks": "On time"
            },
            {
                "studentRollNumber": "SMS2024003",
                "date": "2024-01-15",
                "status": "absent",
                "remarks": "Sick leave"
            }
        ],
        "notifications": [
            {
                "title": "School Reopening",
                "message": "School will reopen on Monday, January 22nd, 2024. All students must report by 8:00 AM.",
                "type": "info",
                "priority": "high",
                "recipientEmail": "ahmed.mohammed@school.com",
                "expiresAt": "2024-01-25T00:00:00Z"
            },
            {
                "title": "PTA Meeting",
                "message": "Parent-Teacher Association meeting scheduled for Friday, January 26th, 2024 at 4:00 PM.",
                "type": "warning",
                "priority": "medium",
                "recipientEmail": "fatima.abubakar@school.com",
                "expiresAt": "2024-01-30T00:00:00Z"
            }
        ]
    }

def main():
    """Main synchronization example"""
    print("🏫 School Management System API - Data Synchronization Example")
    print("=" * 60)

    # Initialize client
    try:
        client = SchoolAPIClient(API_BASE_URL, CLIENT_ID, CLIENT_SECRET)
        print("✅ API Client initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize API client: {e}")
        return 1

    # Authenticate
    try:
        print("\n🔐 Authenticating...")
        auth_result = client.authenticate(USERNAME, PASSWORD)
        print("✅ Authentication successful")
        print(f"   Access Token: {auth_result['access_token'][:20]}...")
        print(f"   Token Type: {auth_result['token_type']}")
        print(f"   Expires In: {auth_result['expires_in']} seconds")
    except SchoolAPIError as e:
        print(f"❌ Authentication failed: {e}")
        if e.status_code == 401:
            print("   Please check your credentials")
        return 1
    except Exception as e:
        print(f"❌ Unexpected error during authentication: {e}")
        return 1

    # Load sample data
    sample_data = load_sample_data()
    print(f"\n📊 Sample data loaded:")
    print(f"   Students: {len(sample_data['students'])}")
    print(f"   Attendance: {len(sample_data['attendance'])}")
    print(f"   Notifications: {len(sample_data['notifications'])}")

    # Sync students
    print("\n👨‍🎓 Synchronizing students...")
    try:
        batch_processor = BatchProcessor(client, batch_size=10)
        student_results = batch_processor.process_students_batch(sample_data['students'])

        print("✅ Student synchronization completed:")
        print(f"   Created: {student_results['created']}")
        print(f"   Updated: {student_results['updated']}")
        print(f"   Errors: {len(student_results['errors'])}")

        if student_results['errors']:
            print("   Error details:")
            for error in student_results['errors'][:3]:  # Show first 3 errors
                print(f"     - {error}")
            if len(student_results['errors']) > 3:
                print(f"     ... and {len(student_results['errors']) - 3} more")

    except SchoolAPIError as e:
        print(f"❌ Student synchronization failed: {e}")
    except Exception as e:
        print(f"❌ Unexpected error during student sync: {e}")

    # Sync attendance
    print("\n📅 Synchronizing attendance...")
    try:
        attendance_results = client.sync_attendance(sample_data['attendance'])

        print("✅ Attendance synchronization completed:")
        print(f"   Created: {attendance_results['created']}")
        print(f"   Updated: {attendance_results['updated']}")
        print(f"   Skipped: {attendance_results['skipped']}")
        print(f"   Errors: {len(attendance_results['errors'])}")

        if attendance_results['errors']:
            print("   Error details:")
            for error in attendance_results['errors'][:3]:
                print(f"     - {error}")
            if len(attendance_results['errors']) > 3:
                print(f"     ... and {len(attendance_results['errors']) - 3} more")

    except SchoolAPIError as e:
        print(f"❌ Attendance synchronization failed: {e}")
    except Exception as e:
        print(f"❌ Unexpected error during attendance sync: {e}")

    # Sync notifications
    print("\n📢 Synchronizing notifications...")
    try:
        notification_results = client.sync_notifications(sample_data['notifications'])

        print("✅ Notification synchronization completed:")
        print(f"   Created: {notification_results['created']}")
        print(f"   Errors: {len(notification_results['errors'])}")

        if notification_results['errors']:
            print("   Error details:")
            for error in notification_results['errors'][:3]:
                print(f"     - {error}")
            if len(notification_results['errors']) > 3:
                print(f"     ... and {len(notification_results['errors']) - 3} more")

    except SchoolAPIError as e:
        print(f"❌ Notification synchronization failed: {e}")
    except Exception as e:
        print(f"❌ Unexpected error during notification sync: {e}")

    # Get sync status
    print("\n📈 Getting synchronization status...")
    try:
        status = client.get_sync_status()
        print("✅ Current sync status:")
        print(f"   Students: {status['counts']['students']}")
        print(f"   Attendance: {status['counts']['attendance']}")
        print(f"   Notifications: {status['counts']['notifications']}")
        print(f"   Last sync: {status['lastSync']}")

    except SchoolAPIError as e:
        print(f"❌ Failed to get sync status: {e}")
    except Exception as e:
        print(f"❌ Unexpected error getting sync status: {e}")

    # Test data retrieval
    print("\n🔍 Testing data retrieval...")
    try:
        students = client.get_students(limit=5)
        print(f"✅ Retrieved {students['count']} students")

        if students['count'] > 0:
            print("   Sample student:")
            sample_student = students['data'][0]
            print(f"     Name: {sample_student['user']['firstName']} {sample_student['user']['lastName']}")
            print(f"     Email: {sample_student['user']['email']}")
            print(f"     Roll Number: {sample_student['rollNumber']}")

    except SchoolAPIError as e:
        print(f"❌ Failed to retrieve students: {e}")
    except Exception as e:
        print(f"❌ Unexpected error retrieving students: {e}")

    print("\n🎉 Synchronization example completed!")
    print("=" * 60)
    return 0

if __name__ == "__main__":
    sys.exit(main())