from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, AppointmentViewSet

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet)
router.register(r'appointments', AppointmentViewSet)

urlpatterns = router.urls
