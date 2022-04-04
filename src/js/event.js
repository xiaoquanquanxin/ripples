const save = document.getElementById('save');
const reset = document.getElementById('reset');
const dropRadius = document.getElementById('dropRadius');
const perturbance = document.getElementById('perturbance');
const resolution = document.getElementById('resolution');

const initFn = () => {
	dropRadius.value = +localStorage.getItem('dropRadius') || 20;
	perturbance.value = +localStorage.getItem('perturbance') || .01;
	resolution.value = +localStorage.getItem('resolution') || 500;
};
initFn();

$(window).on('load', function (){
	$('.canvas-bgi').ripples({
		//	初始扩散半径
		dropRadius: dropRadius.value,
		//	波的深度，越深辐射越远
		perturbance: perturbance.value,
		//	波的粘性，粘性大扩散慢
		resolution: resolution.value,
		crossOrigin: '*',
	});
});
const saveFn = () => {
	localStorage.setItem('dropRadius', +isNaN(dropRadius.value) ? 0 : dropRadius.value);
	localStorage.setItem('perturbance', +isNaN(perturbance.value) ? 0 : perturbance.value);
	localStorage.setItem('resolution', +isNaN(resolution.value) ? 0 : resolution.value);
	window.location.reload();
};
//	保存
save.onclick = saveFn;
//	重置
reset.onclick = () => {
	dropRadius.value = 20;
	perturbance.value = .01;
	resolution.value = 500;
	saveFn();
};
