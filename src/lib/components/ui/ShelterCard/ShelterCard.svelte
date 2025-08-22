<script lang="ts">
    // Props
    export let title: string = "Default Title";
    export let distance: number = 0.4;
    export let address: string = "423 East Central, Springfield, MO 65802";
  </script>
  
  <style>
    .card {
      border-radius: 0.5rem;
      background-color: #f4f4f4;
      /* border: 1px solid #ccc; */
      margin-bottom: 8px;
      display: flex;
      flex-direction: row;
    }
    .distance-view{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 16px;
    }
    .distance-number{
      font-family: "DM Sans", sans-serif;
      color: #C91C1C;
      font-size: 22px;
      line-height: 18px;
      font-weight: 900;
    }
    .miles-away{
      font-family: "DM Sans", sans-serif;
      color: #C91C1C;
      font-size: 6px;
      line-height: 18px;
    }
  
    h2 {
      /* margin-bottom: 16px; */
      font-size: 16px;
      font-weight: 800;
    }
    .address-text{

    }
  
    button {
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      border: none;
    }
    .shelter-img{
      /* height: 100%; */
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
      width: 150px;
    }
    .text-view{
      padding:16px 
    }
    
  </style>
  
  <div class="card">
    <div class="distance-view">
      <p class="distance-number">{distance}</p>
      <p class="miles-away">Miles Away</p>
    </div>
    <div class="text-view">
      <h2>{title}</h2>
      <p class="address-text">
        {address}
      </p>
    </div>
    
    <!-- <button on:click={increment}>Increment</button> -->
  </div>