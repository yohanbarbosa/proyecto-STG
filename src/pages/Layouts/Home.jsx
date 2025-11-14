import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

 function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      icon: "mdi:file-document-outline",
      title: "Certificados",
      description: "Solicita certificados de nacimiento, matrimonio y defunción",
      color: "bg-blue-500",
      count: "12 trámites"
    },
    {
      icon: "mdi:account-card-details",
      title: "Identificación",
      description: "Renovación de cédula, pasaporte y documentos de identidad",
      color: "bg-green-500",
      count: "8 trámites"
    },
    {
      icon: "mdi:shield-check",
      title: "Seguridad Social",
      description: "Afiliación, certificados de salud y pensiones",
      color: "bg-purple-500",
      count: "15 trámites"
    },
    {
      icon: "mdi:calendar-clock",
      title: "Citas",
      description: "Agenda citas para atención presencial en oficinas",
      color: "bg-orange-500",
      count: "Disponible 24/7"
    }
  ];

  const recentProcedures = [
    { name: "Certificado de Nacimiento", status: "Completado", date: "15 Oct 2025", statusColor: "text-green-600" },
    { name: "Renovación de Cédula", status: "En proceso", date: "10 Oct 2025", statusColor: "text-yellow-600" },
    { name: "Antecedentes Penales", status: "Pendiente pago", date: "08 Oct 2025", statusColor: "text-red-600" },
  ];

  const stats = [
    { label: "Trámites Disponibles", value: "150+" },
    { label: "Usuarios Activos", value: "50K+" },
    { label: "Satisfacción", value: "96%" },
    { label: "Tiempo Promedio", value: "5 min" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Icon icon="mdi:shield-check" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">STG</h1>
                <p className="text-xs text-gray-500">Gobierno Digital</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Inicio</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Trámites</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Ayuda</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition">Contacto</a>
            </div>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* <button className="relative p-2 text-gray-600 hover:text-blue-600 transition">
                <Icon icon="mdi:bell-outline" className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button> */}
              <Link to="/login" className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition">
                Ingresar
              </Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                Registrarse
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              <Icon icon={isMenuOpen ? "mdi:close" : "mdi:menu"} className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Inicio</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Trámites</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Ayuda</a>
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2">Contacto</a>
                <div className="pt-3 border-t border-gray-200 flex flex-col space-y-2">
                  <Link to="login" className="px-4 py-2 text-blue-600 font-medium border border-blue-600 rounded-lg">
                    Ingresar
                  </Link>
                  <Link to="register" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg">
                    Registrarse
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-block px-4 py-2 bg-blue-800 bg-opacity-50 rounded-full text-sm mb-6">
                ✨ 100% Digital y Seguro
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Realiza tus trámites gubernamentales desde casa
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Accede a más de 150 servicios digitales las 24 horas del día, sin filas ni desplazamientos. Rápido, seguro y confiable.
              </p>

              {/* Search bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="¿Qué trámite necesitas realizar?"
                  className="w-full px-6 py-4 pr-12 rounded-xl text-gray-900 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
                />
                <button className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Icon icon="mdi:magnify" className="w-6 h-6" />
                </button>
              </div>

              <p className="text-sm text-blue-200 mt-4">
                Búsquedas populares: Certificados, Cédula, Antecedentes, Pensión
              </p>
            </div>

            {/* Right side - Stats card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6">Nuestro Impacto</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link to="/login" className=" inline-block text-center w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition">
                Comenzar Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Servicios Principales</h3>
          <p className="text-gray-600 text-lg">Accede rápidamente a las categorías más solicitadas</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-blue-200"
            >
              <div className={`${service.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <Icon icon={service.icon} className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h4>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{service.count}</span>
                <Icon icon="mdi:chevron-right" className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">¿Por Qué Usar STG?</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:check-circle" className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-bold mb-3">100% Seguro</h4>
            <p className="text-gray-600">Encriptación de datos y cumplimiento de normativas gubernamentales</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:clock-fast" className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-bold mb-3">Ahorra Tiempo</h4>
            <p className="text-gray-600">Completa trámites en minutos sin salir de tu hogar</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:shield-check" className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="text-xl font-bold mb-3">Siempre Disponible</h4>
            <p className="text-gray-600">Acceso 24/7 desde cualquier dispositivo conectado</p>
          </div>
        </div>
      </section> 

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon icon="mdi:shield-check" className="w-8 h-8" />
                <span className="text-xl font-bold">STG</span>
              </div>
              <p className="text-gray-400 text-sm">Transformando la gestión gubernamental con tecnología digital</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Servicios</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Certificados</a></li>
                <li><a href="#" className="hover:text-white transition">Identificación</a></li>
                <li><a href="#" className="hover:text-white transition">Seguridad Social</a></li>
                <li><a href="#" className="hover:text-white transition">Citas</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Soporte</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition">Preguntas Frecuentes</a></li>
                <li><a href="#" className="hover:text-white transition">Tutoriales</a></li>
                <li><a href="#" className="hover:text-white transition">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Términos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition">Seguridad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 STG. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default Home;