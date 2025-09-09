<div
	class="fixed right-0 h-screen w-[400px] bg-white p-12 px-4 rounded-tl-2xl rounded-bl-2xl overflow-y-auto 
           md:rounded-br-none md:rounded-tr-none
           md:right-0 md:top-0
           max-md:bottom-0 max-md:w-screen max-md:h-1/2 max-md:p-4 max-md:rounded-tr-2xl max-md:rounded-bl-none z-60"
>
	<!-- Handle only shows on mobile -->
	<div class="hidden max-md:flex w-full justify-center items-center">
		<div class="w-[60px] h-[4px] rounded-lg bg-gray-400 mb-4"></div>
	</div>

	<h1 class="text-[22px] leading-[22px] font-extrabold text-left font-[DM_Sans] pb-4">
		Storm Shelters Near You
	</h1>

	<div>
		<slot></slot>
	</div>
</div>