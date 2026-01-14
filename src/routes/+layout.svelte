<script>
	import { Info,SunMoon } from 'lucide-svelte';
	let size = 25;
	let color= 'white';
</script>

<div style="z-index:1000; background-color:black; top: 0;;">
    <div style="display: flex; justify-content:center; align-items:center; margin-left:10px; margin-top:10px; margin-right:10px;">
		<SunMoon {color} {size}/>
	<div style="display:flex; justify-content: center; text-align: center; align-items: center; width:100%;">
		<img src="/detero.png" alt="" width="30px" height="30px">
		<h1 style="color: white;">DETRO </h1>
		<div height="5px" style="padding:2px; border:1; border-radius: 3px;" >
			<p style="color:#c0282c; margin:0px; padding-right:5px">‎ Beta</p>
		</div>
	</div>
	<Info {color} {size}/>
    </div>
</div>
<slot />