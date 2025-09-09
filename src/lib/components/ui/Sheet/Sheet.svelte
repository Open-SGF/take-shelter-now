<div
	class="fixed right-0 z-60 h-screen w-[400px] overflow-y-auto rounded-tl-2xl rounded-bl-2xl bg-white p-12
           px-4 max-md:bottom-0
           max-md:h-1/2 max-md:w-screen
           max-md:rounded-tr-2xl max-md:rounded-bl-none max-md:p-4 md:top-0 md:right-0 md:rounded-tr-none md:rounded-br-none"
>
	<!-- Handle only shows on mobile -->
	<div class="hidden w-full items-center justify-center max-md:flex">
		<div class="mb-4 h-[4px] w-[60px] rounded-lg bg-gray-400"></div>
	</div>

	<h1 class="pb-4 text-left font-[DM_Sans] text-[22px] leading-[22px] font-extrabold">
		Storm Shelters Near You
	</h1>

	<div>
		<slot></slot>
	</div>
</div>
