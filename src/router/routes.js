
const routes = [
  {
    path: '/home',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', meta: {requiredAuth: true}, component: () => import('pages/Index.vue') },
      { path: '/todos', meta: {requiredAuth: true}, name: 'todos', component: () => import('pages/todos.vue') },
      { path: '/userlogin', meta: {requiredAuth: true}, name: 'userlogin', component: () => import('pages/userlogin.vue') },
      { path: '/gallery', meta: {requiredAuth: true}, name: 'gallery', component: () => import('pages/gallery.vue') },
      { path: '/assignedEvent', meta: {requiredAuth: true}, name: 'assignedEvent', component: () => import('pages/assignedEvent.vue') },
      { path: '/calendar', meta: {requiredAuth: true}, name: 'calendar', component: () => import('pages/calendar.vue') },
      { path: '/placeTrack', meta: {requiredAuth: true}, name: 'placeTrack', component: () => import('pages/placeTrack.vue') },
      { path: '/food', meta: {requiredAuth: true}, name: 'food', component: () => import('pages/food.vue') },
      { path: '/motif', meta: {requiredAuth: true}, name: 'motif', component: () => import('pages/motif.vue') },
      { path: '/account', meta: {requiredAuth: true}, name: 'account', component: () => import('pages/account.vue') },
      { path: '/packages', meta: {requiredAuth: true}, name: 'packages', component: () => import('pages/packages.vue') },
      { path: '/manpower', meta: {requiredAuth: true}, name: 'manpower', component: () => import('pages/manpower.vue') },
      { path: '/brgy', meta: {requiredAuth: true}, name: 'brgy', component: () => import('pages/brgy.vue') },
      { path: '/city', meta: {requiredAuth: true}, name: 'city', component: () => import('pages/city.vue') },
      { path: '/dishprice', meta: {requiredAuth: true}, name: 'dishprice', component: () => import('pages/dishprice.vue') },
      { path: '/position', meta: {requiredAuth: true}, name: 'position', component: () => import('pages/position.vue') },
      { path: '/reserve', meta: {requiredAuth: true}, name: 'reserve', component: () => import('pages/reserve.vue') },
      { path: '/dish', meta: {requiredAuth: true}, name: 'dish', component: () => import('pages/dish.vue') },
      { path: '/setup', meta: {requiredAuth: true}, name: 'setup', component: () => import('pages/setup.vue') },
      { path: '/services', meta: {requiredAuth: true}, name: 'services', component: () => import('pages/services.vue') },
      { path: '/paidEvents', meta: {requiredAuth: true}, name: 'paidEvents', component: () => import('pages/paidEvents.vue') },
      { path: '/amenities', meta: {requiredAuth: true}, name: 'amenities', component: () => import('pages/amenities.vue') },
      { path: '/category', meta: {requiredAuth: true}, name: 'category', component: () => import('pages/category.vue') },
      { path: '/todayEvent', meta: {requiredAuth: true}, name: 'todayEvent', component: () => import('pages/todayEvent.vue') },
      { path: '/todayReserve', meta: {requiredAuth: true}, name: 'todayReserve', component: () => import('pages/todayReserve.vue') },
      { path: '/finishedEvent', meta: {requiredAuth: true}, name: 'finishedEvent', component: () => import('pages/finishedEvent.vue') },
      { path: '/events', meta: {requiredAuth: true}, name: 'events', component: () => import('pages/events.vue') },
      { path: '/cancelEvent', meta: {requiredAuth: true}, name: 'cancelEvent', component: () => import('pages/cancelEvent.vue') },
      { path: '/notify', meta: {requiredAuth: true}, name: 'notify', component: () => import('pages/notify.vue') },
      { path: '/terms', meta: {requiredAuth: true}, name: 'terms', component: () => import('pages/terms.vue') },
      { path: '/paymentMode', meta: {requiredAuth: true}, name: 'paymentMode', component: () => import('pages/paymentMode.vue') },
      { path: '/reportsReservation', meta: {requiredAuth: true}, name: 'reportsReservation', component: () => import('pages/reportsReservation.vue') },
      { path: '/reportsClient', meta: {requiredAuth: true}, name: 'reportsClient', component: () => import('pages/reportsClient.vue') },
      { path: '/reportsEvent', meta: {requiredAuth: true}, name: 'reportsEvent', component: () => import('pages/reportsEvent.vue') },
      { path: '/reportsCancelled', meta: {requiredAuth: true}, name: 'reportsCancelled', component: () => import('pages/reportsCancelled.vue') },
      { path: '/reportsFood', meta: {requiredAuth: true}, name: 'reportsFood', component: () => import('pages/reportsFood.vue') },
      { path: '/reportsBalance', meta: {requiredAuth: true}, name: 'reportsBalance', component: () => import('pages/reportsBalance.vue') },
      { path: '/reportsPaid', meta: {requiredAuth: true}, name: 'reportsPaid', component: () => import('pages/reportsPaid.vue') },
      { path: '/maps', meta: {requiredAuth: true}, name: 'maps', component: () => import('pages/maps.vue') },
      { path: '/reportsclientReserve', meta: {requiredAuth: true}, name: 'reportsclientReserve', component: () => import('pages/reportsclientReserve.vue') },
      { path: '/sample', meta: {requiredAuth: true}, name: 'sample', component: () => import('pages/sample.vue') }
    ]
  },
  { path: '/', component: () => import('pages/login.vue') },
  { path: '/signup', component: () => import('pages/signup.vue') }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
