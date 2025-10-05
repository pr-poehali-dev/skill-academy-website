import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type AppointmentStatus = 'pending' | 'accepted' | 'in-progress' | 'completed' | 'rejected';

interface Patient {
  id: number;
  fullName: string;
  passport: string;
  age: number;
  isChild: boolean;
  phone: string;
  complaints: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  diagnosis?: string;
  recommendations?: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  patients: number;
  schedule: string;
  rating: number;
}

const newPatientsPool: Omit<Patient, 'id' | 'status'>[] = [
  {
    fullName: 'Кузнецова Ольга Викторовна',
    passport: '4822 901234',
    age: 29,
    isChild: false,
    phone: '+7 (926) 123-45-67',
    complaints: 'Боль в горле, температура 37.8°C, слабость',
    doctor: 'Павлова Анна Сергеевна',
    specialty: 'ЛОР',
    date: '2024-10-08',
    time: '16:30'
  },
  {
    fullName: 'Николаев Виктор Андреевич',
    passport: '4623 112233',
    age: 58,
    isChild: false,
    phone: '+7 (903) 234-56-78',
    complaints: 'Повышенное давление 160/95, головокружение',
    doctor: 'Козлова Елена Дмитриевна',
    specialty: 'Кардиолог',
    date: '2024-10-08',
    time: '17:00'
  },
  {
    fullName: 'Белова Татьяна Игоревна (представитель ребенка)',
    passport: '4724 334455',
    age: 5,
    isChild: true,
    phone: '+7 (915) 345-67-89',
    complaints: 'У ребёнка (Белов Максим, 5 лет) сыпь на теле, зуд, покраснения',
    doctor: 'Лебедева Мария Сергеевна',
    specialty: 'Дерматолог',
    date: '2024-10-08',
    time: '17:30'
  },
  {
    fullName: 'Семёнов Павел Дмитриевич',
    passport: '4525 556677',
    age: 41,
    isChild: false,
    phone: '+7 (918) 456-78-90',
    complaints: 'Острая боль в пояснице, отдаёт в ногу',
    doctor: 'Волков Сергей Петрович',
    specialty: 'Ортопед',
    date: '2024-10-08',
    time: '18:00'
  },
  {
    fullName: 'Григорьева Светлана Павловна',
    passport: '4826 778899',
    age: 36,
    isChild: false,
    phone: '+7 (922) 567-89-01',
    complaints: 'Боль в животе, тошнота, нарушение пищеварения',
    doctor: 'Смирнов Андрей Викторович',
    specialty: 'Терапевт',
    date: '2024-10-08',
    time: '18:30'
  }
];

const doctors: Doctor[] = [
  { id: 1, name: 'Смирнов Андрей Викторович', specialty: 'Терапевт', experience: '12 лет', patients: 1250, schedule: 'Пн-Пт 9:00-18:00', rating: 4.8 },
  { id: 2, name: 'Козлова Елена Дмитриевна', specialty: 'Кардиолог', experience: '15 лет', patients: 980, schedule: 'Пн-Ср 10:00-17:00', rating: 4.9 },
  { id: 3, name: 'Новикова Ольга Александровна', specialty: 'Педиатр', experience: '8 лет', patients: 1560, schedule: 'Вт-Сб 9:00-16:00', rating: 4.7 },
  { id: 4, name: 'Волков Сергей Петрович', specialty: 'Ортопед', experience: '18 лет', patients: 820, schedule: 'Ср-Пт 11:00-19:00', rating: 4.9 },
  { id: 5, name: 'Лебедева Мария Сергеевна', specialty: 'Дерматолог', experience: '10 лет', patients: 1100, schedule: 'Пн-Чт 10:00-18:00', rating: 4.6 },
  { id: 6, name: 'Федоров Алексей Иванович', specialty: 'Стоматолог', experience: '14 лет', patients: 1380, schedule: 'Пн-Пт 8:00-20:00', rating: 4.8 },
  { id: 7, name: 'Павлова Анна Сергеевна', specialty: 'ЛОР', experience: '9 лет', patients: 950, schedule: 'Вт-Сб 9:00-17:00', rating: 4.7 }
];

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedAppointment, setSelectedAppointment] = useState<Patient | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [nextPatientIndex, setNextPatientIndex] = useState(0);
  const [appointments, setAppointments] = useState<Patient[]>([
    {
      id: 1,
      fullName: 'Иванова Мария Петровна',
      passport: '4512 789456',
      age: 34,
      isChild: false,
      phone: '+7 (912) 345-67-89',
      complaints: 'Головные боли, повышенная утомляемость, бессонница в течение последних 2 недель',
      doctor: 'Смирнов Андрей Викторович',
      specialty: 'Терапевт',
      date: '2024-10-08',
      time: '09:00',
      status: 'pending'
    },
    {
      id: 2,
      fullName: 'Петров Александр Сергеевич',
      passport: '4615 234567',
      age: 45,
      isChild: false,
      phone: '+7 (921) 456-78-90',
      complaints: 'Боли в области сердца, одышка при физической нагрузке',
      doctor: 'Козлова Елена Дмитриевна',
      specialty: 'Кардиолог',
      date: '2024-10-08',
      time: '10:30',
      status: 'accepted'
    },
    {
      id: 3,
      fullName: 'Соколова Анна Ивановна (представитель ребенка)',
      passport: '4718 345678',
      age: 7,
      isChild: true,
      phone: '+7 (905) 567-89-01',
      complaints: 'У ребёнка (Соколов Дмитрий, 7 лет) температура 38.5°C, кашель, насморк',
      doctor: 'Новикова Ольга Александровна',
      specialty: 'Педиатр',
      date: '2024-10-08',
      time: '11:00',
      status: 'in-progress'
    },
    {
      id: 4,
      fullName: 'Морозов Дмитрий Николаевич',
      passport: '4519 456789',
      age: 52,
      isChild: false,
      phone: '+7 (913) 678-90-12',
      complaints: 'Боли в коленном суставе, ограничение подвижности',
      doctor: 'Волков Сергей Петрович',
      specialty: 'Ортопед',
      date: '2024-10-08',
      time: '14:00',
      status: 'pending'
    },
    {
      id: 5,
      fullName: 'Васильева Екатерина Андреевна',
      passport: '4620 567890',
      age: 28,
      isChild: false,
      phone: '+7 (908) 789-01-23',
      complaints: 'Аллергическая реакция, сыпь на коже, зуд',
      doctor: 'Лебедева Мария Сергеевна',
      specialty: 'Дерматолог',
      date: '2024-10-08',
      time: '15:30',
      status: 'pending'
    },
    {
      id: 6,
      fullName: 'Сидоров Игорь Владимирович',
      passport: '4721 678901',
      age: 39,
      isChild: false,
      phone: '+7 (917) 890-12-34',
      complaints: 'Острая зубная боль в области нижней челюсти слева',
      doctor: 'Федоров Алексей Иванович',
      specialty: 'Стоматолог',
      date: '2024-10-07',
      time: '16:00',
      status: 'completed',
      diagnosis: 'Кариес, пульпит 36 зуба',
      recommendations: 'Проведено эндодонтическое лечение. Повторный приём через 2 недели для установки пломбы.'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextPatientIndex < newPatientsPool.length) {
        const newPatient = newPatientsPool[nextPatientIndex];
        const newId = Math.max(...appointments.map(a => a.id), 0) + 1;
        
        const patientWithId: Patient = {
          ...newPatient,
          id: newId,
          status: 'pending'
        };

        setAppointments(prev => [patientWithId, ...prev]);
        setNextPatientIndex(prev => prev + 1);

        toast.success('Новая заявка!', {
          description: `${newPatient.fullName} записан к ${newPatient.specialty}`,
          icon: <Icon name="Bell" className="w-5 h-5" />
        });
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [nextPatientIndex, appointments]);

  const updateAppointmentStatus = (id: number, newStatus: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
    );
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig = {
      pending: { label: 'Новая', color: 'bg-blue-500' },
      accepted: { label: 'Принята', color: 'bg-green-500' },
      'in-progress': { label: 'На приёме', color: 'bg-yellow-500' },
      completed: { label: 'Завершена', color: 'bg-gray-500' },
      rejected: { label: 'Отклонена', color: 'bg-red-500' }
    };
    const config = statusConfig[status];
    return <Badge className={`${config.color} text-white border-0`}>{config.label}</Badge>;
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    accepted: appointments.filter(a => a.status === 'accepted').length,
    inProgress: appointments.filter(a => a.status === 'in-progress').length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch = apt.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const navItems = [
    { id: 'dashboard', label: 'Главная', icon: 'LayoutDashboard' },
    { id: 'appointments', label: 'Записи', icon: 'ClipboardList' },
    { id: 'doctors', label: 'Врачи', icon: 'Users' },
    { id: 'statistics', label: 'Статистика', icon: 'BarChart3' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-red-600 rounded-lg flex items-center justify-center shadow-md relative">
                <div className="absolute w-6 h-1.5 bg-white rounded-full"></div>
                <div className="absolute w-1.5 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">МедЦентр Плюс</h1>
                <p className="text-sm text-gray-500">Система управления</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  onClick={() => setActiveSection(item.id)}
                  className={activeSection === item.id ? 'bg-red-600' : ''}
                >
                  <Icon name={item.icon as any} className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>

            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="w-9 h-9 ring-2 ring-red-500">
                    <AvatarFallback className="bg-red-600 text-white font-bold">
                      ДМ
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900">Директор</p>
                    <p className="text-xs text-gray-500">Михайлов Д.А.</p>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Профиль директора</DialogTitle>
                  <DialogDescription>
                    Общая информация и статистика работы
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white">
                    <Avatar className="w-24 h-24 ring-4 ring-white/50">
                      <AvatarFallback className="bg-white/20 text-white text-3xl font-bold">
                        ДМ
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">Дмитрий Анатольевич Михайлов</h3>
                      <p className="text-red-100 text-lg">Директор медицинского центра</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="flex items-center">
                          <Icon name="Briefcase" className="w-4 h-4 mr-1" />
                          Стаж: 15 лет
                        </span>
                        <span className="flex items-center">
                          <Icon name="Award" className="w-4 h-4 mr-1" />
                          Врач высшей категории
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Принято</CardDescription>
                        <CardTitle className="text-3xl text-red-600">{stats.accepted + stats.inProgress}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Завершено</CardDescription>
                        <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>В очереди</CardDescription>
                        <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Всего</CardDescription>
                        <CardTitle className="text-3xl text-gray-600">{stats.total}</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Icon name="TrendingUp" className="w-5 h-5 mr-2 text-red-600" />
                        Эффективность работы
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Обработано заявок</span>
                          <span className="font-semibold">{Math.round((stats.accepted + stats.completed) / stats.total * 100)}%</span>
                        </div>
                        <Progress value={(stats.accepted + stats.completed) / stats.total * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Завершённые приёмы</span>
                          <span className="font-semibold">{Math.round(stats.completed / stats.total * 100)}%</span>
                        </div>
                        <Progress value={stats.completed / stats.total * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="md:hidden bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-2 space-x-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'default' : 'ghost'}
                onClick={() => setActiveSection(item.id)}
                className={`flex-shrink-0 ${activeSection === item.id ? 'bg-red-600' : ''}`}
                size="sm"
              >
                <Icon name={item.icon as any} className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Панель управления</h2>
              <p className="text-gray-600">Общая статистика по медицинскому центру</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription>Всего записей</CardDescription>
                  <CardTitle className="text-4xl text-gray-900">{stats.total}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600">
                    <Icon name="Calendar" className="w-4 h-4 mr-1" />
                    Сегодня
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-blue-100">
                <CardHeader className="pb-3">
                  <CardDescription className="text-blue-700">Новые заявки</CardDescription>
                  <CardTitle className="text-4xl text-blue-600">{stats.pending}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-blue-600">
                    <Icon name="Clock" className="w-4 h-4 mr-1" />
                    Ожидают
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-green-100">
                <CardHeader className="pb-3">
                  <CardDescription className="text-green-700">Принято</CardDescription>
                  <CardTitle className="text-4xl text-green-600">{stats.accepted}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-green-600">
                    <Icon name="CheckCircle" className="w-4 h-4 mr-1" />
                    Подтверждено
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-yellow-100">
                <CardHeader className="pb-3">
                  <CardDescription className="text-yellow-700">На приёме</CardDescription>
                  <CardTitle className="text-4xl text-yellow-600">{stats.inProgress}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-yellow-600">
                    <Icon name="Activity" className="w-4 h-4 mr-1" />
                    В процессе
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-gray-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-gray-700">Завершено</CardDescription>
                  <CardTitle className="text-4xl text-gray-600">{stats.completed}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600">
                    <Icon name="CheckCheck" className="w-4 h-4 mr-1" />
                    Выполнено
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Clock" className="w-5 h-5 mr-2 text-red-600" />
                    Последние записи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointments.slice(0, 5).map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{apt.fullName}</p>
                          <p className="text-xs text-gray-500">{apt.specialty} • {apt.time}</p>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Users" className="w-5 h-5 mr-2 text-red-600" />
                    Врачи на смене
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {doctors.slice(0, 5).map((doctor) => (
                      <div key={doctor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-red-100 text-red-700 font-semibold">
                              {doctor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{doctor.name}</p>
                            <p className="text-xs text-gray-500">{doctor.specialty}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">{doctor.experience}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'appointments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Управление записями</h2>
              <p className="text-gray-600">Все записи пациентов на приём</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Search" className="w-5 h-5 mr-2 text-red-600" />
                  Фильтры и поиск
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Icon name="Search" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Поиск по ФИО, врачу или специальности..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10"
                    />
                  </div>
                  <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full md:w-auto">
                    <TabsList>
                      <TabsTrigger value="all">Все</TabsTrigger>
                      <TabsTrigger value="pending">Новые</TabsTrigger>
                      <TabsTrigger value="accepted">Принятые</TabsTrigger>
                      <TabsTrigger value="in-progress">На приёме</TabsTrigger>
                      <TabsTrigger value="completed">Завершённые</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">{appointment.fullName}</CardTitle>
                          {appointment.isChild && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              <Icon name="Baby" className="w-3 h-3 mr-1" />
                              Ребёнок
                            </Badge>
                          )}
                          {getStatusBadge(appointment.status)}
                        </div>
                        <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center">
                            <Icon name="User" className="w-4 h-4 mr-1" />
                            {appointment.doctor}
                          </span>
                          <span className="flex items-center">
                            <Icon name="Stethoscope" className="w-4 h-4 mr-1" />
                            {appointment.specialty}
                          </span>
                          <span className="flex items-center">
                            <Icon name="Calendar" className="w-4 h-4 mr-1" />
                            {new Date(appointment.date).toLocaleDateString('ru-RU')} в {appointment.time}
                          </span>
                        </CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                            <Icon name="Eye" className="w-4 h-4 mr-2" />
                            Подробнее
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              Карточка записи #{appointment.id}
                              {getStatusBadge(appointment.status)}
                            </DialogTitle>
                            <DialogDescription>
                              Полная информация о записи пациента
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6">
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                                <Icon name="User" className="w-5 h-5 mr-2 text-red-600" />
                                Данные пациента
                              </h3>
                              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                  <Label className="text-gray-600">ФИО</Label>
                                  <p className="font-medium">{appointment.fullName}</p>
                                </div>
                                <div>
                                  <Label className="text-gray-600">Паспорт</Label>
                                  <p className="font-medium">{appointment.passport}</p>
                                </div>
                                <div>
                                  <Label className="text-gray-600">Возраст</Label>
                                  <p className="font-medium">{appointment.age} {appointment.isChild ? 'лет' : 'года'}</p>
                                </div>
                                <div>
                                  <Label className="text-gray-600">Телефон</Label>
                                  <p className="font-medium">{appointment.phone}</p>
                                </div>
                                <div className="col-span-2">
                                  <Label className="text-gray-600">Категория</Label>
                                  <p className="font-medium">
                                    {appointment.isChild ? '👶 Детский приём' : '👤 Взрослый приём'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                                <Icon name="Stethoscope" className="w-5 h-5 mr-2 text-red-600" />
                                Информация о приёме
                              </h3>
                              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                  <Label className="text-gray-600">Врач</Label>
                                  <p className="font-medium">{appointment.doctor}</p>
                                </div>
                                <div>
                                  <Label className="text-gray-600">Специальность</Label>
                                  <p className="font-medium">{appointment.specialty}</p>
                                </div>
                                <div>
                                  <Label className="text-gray-600">Дата</Label>
                                  <p className="font-medium">{new Date(appointment.date).toLocaleDateString('ru-RU')}</p>
                                </div>
                                <div>
                                  <Label className="text-gray-600">Время</Label>
                                  <p className="font-medium">{appointment.time}</p>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                                <Icon name="FileText" className="w-5 h-5 mr-2 text-red-600" />
                                Жалобы пациента
                              </h3>
                              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                <p className="text-gray-900">{appointment.complaints}</p>
                              </div>
                            </div>

                            {appointment.diagnosis && (
                              <>
                                <Separator />
                                <div>
                                  <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                                    <Icon name="Clipboard" className="w-5 h-5 mr-2 text-red-600" />
                                    Диагноз
                                  </h3>
                                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                    <p className="text-gray-900">{appointment.diagnosis}</p>
                                  </div>
                                </div>
                              </>
                            )}

                            {appointment.recommendations && (
                              <>
                                <Separator />
                                <div>
                                  <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                                    <Icon name="Pill" className="w-5 h-5 mr-2 text-red-600" />
                                    Рекомендации
                                  </h3>
                                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                    <p className="text-gray-900">{appointment.recommendations}</p>
                                  </div>
                                </div>
                              </>
                            )}

                            <Separator />

                            <div className="flex gap-2">
                              {appointment.status === 'pending' && (
                                <>
                                  <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'accepted')}
                                  >
                                    <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
                                    Принять заявку
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'rejected')}
                                  >
                                    <Icon name="XCircle" className="w-4 h-4 mr-2" />
                                    Отклонить
                                  </Button>
                                </>
                              )}
                              {appointment.status === 'accepted' && (
                                <Button
                                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
                                >
                                  <Icon name="Activity" className="w-4 h-4 mr-2" />
                                  Начать приём
                                </Button>
                              )}
                              {appointment.status === 'in-progress' && (
                                <Button
                                  className="flex-1 bg-gray-600 hover:bg-gray-700"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                >
                                  <Icon name="CheckCheck" className="w-4 h-4 mr-2" />
                                  Завершить приём
                                </Button>
                              )}
                              {appointment.status === 'completed' && (
                                <div className="flex-1 text-center text-green-600 font-medium py-2">
                                  <Icon name="CheckCheck" className="w-5 h-5 inline mr-2" />
                                  Приём завершён
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-2 text-sm">
                      <Icon name="MessageSquare" className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-gray-600 line-clamp-2">{appointment.complaints}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t">
                    <div className="flex items-center justify-between w-full text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Icon name="IdCard" className="w-4 h-4 mr-1" />
                          {appointment.passport}
                        </span>
                        <span className="flex items-center">
                          <Icon name="Phone" className="w-4 h-4 mr-1" />
                          {appointment.phone}
                        </span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Icon name="FileSearch" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Записи не найдены</h3>
                  <p className="text-gray-600">Попробуйте изменить фильтры или поисковый запрос</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeSection === 'doctors' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Наши врачи</h2>
              <p className="text-gray-600">Список всех специалистов медицинского центра</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-16 h-16 ring-2 ring-red-500">
                        <AvatarFallback className="bg-red-100 text-red-700 text-xl font-bold">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        <CardDescription>{doctor.specialty}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{doctor.experience}</Badge>
                      <div className="flex items-center text-yellow-500">
                        <Icon name="Star" className="w-4 h-4 fill-yellow-500 mr-1" />
                        <span className="text-sm font-semibold text-gray-900">{doctor.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Принято пациентов</span>
                      <span className="font-semibold text-gray-900">{doctor.patients}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Icon name="Clock" className="w-4 h-4 mr-2 text-red-600" />
                      <span className="text-gray-600">{doctor.schedule}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Icon name="Calendar" className="w-4 h-4 mr-2" />
                      Расписание
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'statistics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Статистика</h2>
              <p className="text-gray-600">Аналитика работы медицинского центра</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Icon name="Users" className="w-5 h-5 mr-2 text-red-600" />
                    Пациенты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Всего записей</span>
                    <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Взрослые</span>
                    <span className="text-xl font-semibold text-gray-700">
                      {appointments.filter(a => !a.isChild).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Дети</span>
                    <span className="text-xl font-semibold text-gray-700">
                      {appointments.filter(a => a.isChild).length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Icon name="Activity" className="w-5 h-5 mr-2 text-red-600" />
                    Статусы
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Новые</span>
                      <span className="font-semibold">{stats.pending} ({Math.round(stats.pending / stats.total * 100)}%)</span>
                    </div>
                    <Progress value={stats.pending / stats.total * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Принятые</span>
                      <span className="font-semibold">{stats.accepted} ({Math.round(stats.accepted / stats.total * 100)}%)</span>
                    </div>
                    <Progress value={stats.accepted / stats.total * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Завершённые</span>
                      <span className="font-semibold">{stats.completed} ({Math.round(stats.completed / stats.total * 100)}%)</span>
                    </div>
                    <Progress value={stats.completed / stats.total * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Icon name="TrendingUp" className="w-5 h-5 mr-2 text-red-600" />
                    Эффективность
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-red-600">
                      {Math.round((stats.accepted + stats.completed) / stats.total * 100)}%
                    </p>
                    <p className="text-gray-600 mt-2">Обработано</p>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {Math.round(stats.completed / stats.total * 100)}%
                    </p>
                    <p className="text-gray-600 mt-1">Завершено</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Stethoscope" className="w-5 h-5 mr-2 text-red-600" />
                  Распределение по специальностям
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(
                    appointments.reduce((acc, apt) => {
                      acc[apt.specialty] = (acc[apt.specialty] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([specialty, count]) => (
                    <div key={specialty} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">{specialty}</p>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                      <Progress value={(count / appointments.length) * 100} className="h-2" />
                      <p className="text-xs text-gray-500 mt-2">
                        {Math.round((count / appointments.length) * 100)}% от общего числа
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
