export const MOCK_PROPERTIES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Penthouse Exclusivo con Vista Panorámica',
    location: 'Cerro Gordo, León',
    price: 12500000,
    beds: 3,
    baths: 3.5,
    sqft: 250,
    type: 'departamento',
    lat: 21.155,
    lng: -101.695,
    isFavorite: true,
    tags: [
      { text: 'Venta', variant: 'venta' as const },
      { text: 'Nuevo', variant: 'nuevo' as const }
    ]
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Casa Moderna con Alberca y Jardín Amplio',
    location: 'El Bosque Country Club, León',
    price: 8500000,
    beds: 4,
    baths: 4.5,
    sqft: 450,
    type: 'casa',
    lat: 21.160,
    lng: -101.690,
    isFavorite: false,
    tags: [
      { text: 'Venta', variant: 'venta' as const }
    ]
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Loft de Diseño Contemporáneo',
    location: 'Centro Histórico, León',
    price: 35000,
    beds: 1,
    baths: 1,
    sqft: 90,
    type: 'departamento',
    lat: 21.121,
    lng: -101.682,
    isFavorite: true,
    tags: [
      { text: 'Renta', variant: 'renta' as const }
    ]
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Residencia Minimalista en Fraccionamiento',
    location: 'Mayorazgo Residencial, León',
    price: 5200000,
    beds: 3,
    baths: 3,
    sqft: 280,
    type: 'casa',
    lat: 21.115,
    lng: -101.650,
    isFavorite: false,
    tags: [
      { text: 'Venta', variant: 'venta' as const },
      { text: 'Oportunidad', variant: 'success' as const }
    ]
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Terreno Campestre Vista al Lago',
    location: 'Los Castillos, León',
    price: 3100000,
    beds: 0,
    baths: 0,
    sqft: 1200,
    type: 'terreno',
    lat: 21.175,
    lng: -101.670,
    isFavorite: false,
    tags: [
      { text: 'Venta', variant: 'venta' as const }
    ]
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Departamento Amueblado Céntrico',
    location: 'San Juan de Dios, León',
    price: 22000,
    beds: 2,
    baths: 2,
    sqft: 110,
    type: 'departamento',
    lat: 21.118,
    lng: -101.675,
    isFavorite: true,
    tags: [
      { text: 'Renta', variant: 'renta' as const }
    ]
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Terreno Comercial en Esquina',
    location: 'Blvd. Aeropuerto, León',
    price: 18500000,
    beds: 0,
    baths: 0,
    sqft: 800,
    type: 'terreno',
    lat: 21.090,
    lng: -101.610,
    isFavorite: false,
    tags: [
      { text: 'Venta', variant: 'venta' as const }
    ]
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Estudio para Estudiantes Cerca de la Universidad',
    location: 'Zona Universidad, León',
    price: 9500,
    beds: 1,
    baths: 1,
    sqft: 50,
    type: 'departamento',
    lat: 21.145,
    lng: -101.698,
    isFavorite: true,
    tags: [
      { text: 'Renta', variant: 'renta' as const }
    ]
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Casa Clásica Restaurada',
    location: 'Barrio Arriba, León',
    price: 6800000,
    beds: 5,
    baths: 4,
    sqft: 350,
    type: 'casa',
    lat: 21.125,
    lng: -101.685,
    isFavorite: false,
    tags: [
      { text: 'Venta', variant: 'venta' as const }
    ]
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Departamento con Terraza Privada',
    location: 'Jardines del Moral, León',
    price: 8200000,
    beds: 3,
    baths: 3,
    sqft: 195,
    type: 'departamento',
    lat: 21.140,
    lng: -101.690,
    isFavorite: false,
    tags: [
      { text: 'Venta', variant: 'venta' as const },
      { text: 'Nuevo', variant: 'nuevo' as const }
    ]
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Casa Inteligente en Privada',
    location: 'Gran Jardín Norte, León',
    price: 9500000,
    beds: 3,
    baths: 3.5,
    sqft: 300,
    type: 'casa',
    lat: 21.165,
    lng: -101.690,
    isFavorite: false,
    tags: [
      { text: 'Venta', variant: 'venta' as const },
      { text: 'Oportunidad', variant: 'success' as const }
    ]
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Oficina Corporativa Premium',
    location: 'Plaza Mayor, León',
    price: 35000,
    beds: 0,
    baths: 1,
    sqft: 150,
    type: 'oficina',
    lat: 21.155,
    lng: -101.700,
    isFavorite: true,
    tags: [
      { text: 'Renta', variant: 'renta' as const }
    ]
  },
  {
    id: 13,
    image: 'https://images.unsplash.com/photo-1628611225249-6c3c7c689552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Departamento de Lujo en Torre',
    location: 'Puerta Bajío, León',
    price: 15200000,
    beds: 2,
    baths: 2.5,
    sqft: 200,
    type: 'departamento',
    lat: 21.170,
    lng: -101.710,
    isFavorite: false,
    tags: [
      { text: 'Venta', variant: 'venta' as const },
      { text: 'Nuevo', variant: 'nuevo' as const }
    ]
  },
  {
    id: 14,
    image: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Terreno Residencial Listo para Construir',
    location: 'Cañada del Refugio, León',
    price: 4500000,
    beds: 0,
    baths: 0,
    sqft: 800,
    type: 'terreno',
    lat: 21.168,
    lng: -101.698,
    isFavorite: false,
    tags: [
      { text: 'Venta', variant: 'venta' as const }
    ]
  },
  {
    id: 15,
    image: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Residencia con Acabados de Mármol',
    location: 'Balcones del Campestre, León',
    price: 12800000,
    beds: 4,
    baths: 4.5,
    sqft: 450,
    type: 'casa',
    lat: 21.172,
    lng: -101.695,
    isFavorite: true,
    tags: [
      { text: 'Venta', variant: 'venta' as const }
    ]
  },
  {
    id: 16,
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Local Comercial Alto Flujo',
    location: 'Zona Piel, León',
    price: 45000,
    beds: 0,
    baths: 2,
    sqft: 120,
    type: 'local',
    lat: 21.115,
    lng: -101.668,
    isFavorite: false,
    tags: [
      { text: 'Renta', variant: 'renta' as const }
    ]
  },
  {
    id: 17,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Departamento en Planta Baja',
    location: 'Arbide, León',
    price: 3900000,
    beds: 2,
    baths: 2,
    sqft: 110,
    type: 'departamento',
    lat: 21.130,
    lng: -101.685,
    isFavorite: false,
    tags: [
      { text: 'Venta', variant: 'venta' as const }
    ]
  },
  {
    id: 18,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Casa Amplia para Familia Numerosa',
    location: 'Punta del Este, León',
    price: 7300000,
    beds: 5,
    baths: 4,
    sqft: 320,
    type: 'casa',
    lat: 21.100,
    lng: -101.620,
    isFavorite: false,
    tags: [
      { text: 'Venta', variant: 'venta' as const }
    ]
  }
];
