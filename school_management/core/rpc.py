from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from rest_framework.permissions import IsAuthenticated

class RPCView(APIView):
    """
    Generic Remote Procedure Call endpoint to safely execute PostgreSQL
    Stored Procedures and Functions.
    Expects POST request:
    {
       "procedure": "get_current_academic_year",
       "args": []
    }
    """
    # Temporarily remove IsAuthenticated for easy testing if needed
    # permission_classes = [IsAuthenticated]

    ALLOWED_PROCEDURES = [
        "set_updated_at",
        "has_user_permission",
        "calculate_monthly_average",
        "get_current_academic_year",
        "update_class_attendance",
        "set_subject_pay_rate",
        "log_permission_change",
        "enroll_student",
        "unenroll_student",
        "record_score",
        "get_class_rankings",
        "record_attendance",
        "get_attendance_rate",
        "grant_user_permission",
        "revoke_user_permission",
        "record_student_payment",
        "get_payment_status",
        "generate_report_card",
        "get_class_statistics",
        "assign_class_monitor",
        "get_class_monitors",
        "get_academic_year_info"
    ]

    def post(self, request, format=None):
        procedure = request.data.get('procedure')
        args = request.data.get('args', [])

        if procedure not in self.ALLOWED_PROCEDURES:
            return Response({"error": "Procedure not allowed or does not exist."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            with connection.cursor() as cursor:
                cursor.callproc(procedure, args)
                try:
                    columns = [col[0] for col in cursor.description]
                    results = [
                        dict(zip(columns, row))
                        for row in cursor.fetchall()
                    ]
                    return Response({"results": results}, status=status.HTTP_200_OK)
                except Exception:
                    return Response({"success": True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
