<template>
  <div class="container">
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
    <div></div>
    <v-container fluid>
      <v-toolbar color="secondary" class="elevation-6">
        <v-toolbar-title class="ml-4">
          <a href="#" class="btn-shine">Game Center</a>
        </v-toolbar-title>
        <v-spacer />
        <v-text-field v-model="searchQuery" class="mt-6 mr-2" density="compact" variant="outlined" prepend-inner-icon="mdi-magnify"
          label="Search Game" color="white" />
        <v-btn @click="openGameDialog()" variant="elevated" color="compliment"><v-icon>mdi-plus</v-icon>ADD</v-btn>
      </v-toolbar>
      <!-- FILTERS -->
      <v-card class="mt-1 elevation-6 border border-compliment" rounded="0" color="transparent">
        <v-card-text>

          <v-row class="align-center">
            <v-col cols="3">
              <v-autocomplete v-model="selectedCategory" :items="categoryOptions" variant="outlined" density="compact" placeholder="Filter by Category"
                bg-color="secondary" clearable hide-details />
            </v-col>
            <v-col cols="3">
              <v-autocomplete v-model="selectedBrand" :items="brandOptions" variant="outlined" density="compact" placeholder="Filter by Brand" bg-color="secondary" clearable hide-details />
            </v-col>
            <v-col cols="3">
              <v-btn v-if="hasActiveFilters" @click="clearFilters()" size="large" color="compliment" variant="tonal">
                <v-icon class="mr-1">mdi-close</v-icon>Clear Filters
              </v-btn>
            </v-col>
          </v-row>
          <!-- CARDS -->
          <v-row>
            <v-col v-if="filteredGameList.length === 0" cols="12">
              <div class="text-center pa-8">
                <p class="text-h6">No games found matching your criteria</p>
              </div>
            </v-col>
            <v-col v-for="(item, index) in filteredGameList" :key="index" cols="12" sm="6" md="4" lg="3">
              <v-card class="elevation-5 product-card" color="primary border border-compliment">
                <v-img :src="item.imgUrl" :alt="item.GameName" height="200" cover>
                  <div class="d-flex align-center justify-space-between">
                    <v-chip color="compliment" variant="elevated" class="pa-2 ma-2">{{ item.GameTag }}</v-chip>
                    <div class="d-flex ga-2 mr-2">
                      <v-btn size="28" color="black" @click="openEditDialog(item)"><v-icon>mdi-pencil</v-icon></v-btn>
                      <v-btn size="28" color="red" @click="deleteGame(item._id || item.id)"><v-icon>mdi-delete</v-icon></v-btn>
                    </div>
                  </div>
                </v-img>
                <v-card-text>
                  <div class="mb-3">
                    <span style="font-size: 18px;">{{ item.GameName }}</span>
                  </div>
                  <div class="d-flex justify-space-between align-center">
                    <span>
                      <p style="color:#FFB74D;font-size:12px; ">Released:</p>{{ item.ReleasedDate }}
                    </span>
                    <v-chip color="success">₱{{ item.Price }}</v-chip>
                  </div>


                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>


      <!-- Dialog for Adding/Editing -->
      <v-dialog v-model="dialog" persistent width="550" height="650">
        <v-card color="secondary">
          <v-card-title>
            {{ isEdit ? 'Edit Game Details' : 'Add Game Details' }}
            <v-icon style="float:right;" @click="closeGameDialog()">mdi-close</v-icon>
          </v-card-title>
          <v-card-text>
            <center class="mb-4">
              <v-img v-if="gameObj.imgUrl" height="220" width="200" style="border:1px solid black;"
                :src="gameObj.imgUrl" cover />
            </center>
            <v-text-field v-model="gameObj.imgUrl" variant="outlined" density="compact" label="imgUrl" type="url"
              :rules="[rules.required, rules.validUrl]" />

            <v-row class="align-center">
              <v-col cols="7">
                <v-text-field v-model="gameObj.GameName" variant="outlined" density="compact" label="Game Name"
                  hide-details />
              </v-col>
              <v-col cols="5">
                <v-text-field v-model="gameObj.ReleasedDate" variant="outlined" density="compact" type="date"
                  hide-details />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="gameObj.Price" variant="outlined" density="compact" label="Price" type="number"
                  hide-spin-buttons hide-details/>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="gameObj.Quantity" variant="outlined" density="compact" label="Quantity"
                  type="number" hide-spin-buttons hide-details />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="gameObj.Brand" variant="outlined" density="compact" label="Brand" type="text" />
              </v-col>
              <v-col cols="6">
                <v-select v-model="gameObj.GameTag" :items="gameSelection" variant="outlined" density="compact"
                  label="Game Tag" />
              </v-col>
            </v-row>

            <v-btn @click="isEdit ? updateGame() : AddGameDetail()" block color="compliment" rounded="0">{{ isEdit ? 'Update Game' : 'Add Game' }}</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import api from '../../services/api'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      itemList: [],
      dialog: false,
      gameObj: {},
      GameList: [],
      searchQuery: '',
      selectedCategory: null,
      selectedBrand: null,
      isEdit: false,
      currentGameId: null,
      rules: {
        required: value => !!value || 'Required.',
        validUrl: value => {
          try {
            new URL(value);
            return true;
          } catch (err) {
            return 'URL must include a protocol (e.g., https://)';
          }
        }
      },
      gameSelection: ['Action', 'Horror', 'RPG', 'Strategy', 'Adventure', 'Simulation & Sports', 'Puzzle']

    }

  },
  computed: {
    categoryOptions() {
      return [...new Set(this.GameList.map(game => game.GameTag).filter(Boolean))]
    },
    brandOptions() {
      return [...new Set(this.GameList.map(game => game.Brand).filter(Boolean))]
    },
    filteredGameList() {
      return this.GameList.filter(game => {
        const matchesSearch = this.searchQuery === '' || 
          game.GameName.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        const matchesCategory = this.selectedCategory === null || 
          game.GameTag === this.selectedCategory
        
        const matchesBrand = this.selectedBrand === null || 
          game.Brand === this.selectedBrand
        
        return matchesSearch && matchesCategory && matchesBrand
      })
    },
    hasActiveFilters() {
      return this.searchQuery !== '' || this.selectedCategory !== null || this.selectedBrand !== null
    }
  },
  mounted() {
    this.getGameData()
  },
  methods: {
    openGameDialog() {
      this.dialog = true
      this.gameObj = {}
      this.isEdit = false
      this.currentGameId = null
    },
    openEditDialog(item) {
      this.gameObj = { ...item }
      this.currentGameId = item._id 
      this.isEdit = true
      this.dialog = true
    },
    closeGameDialog() {
      this.dialog = false
      this.isEdit = false
      this.currentGameId = null
    },
    clearFilters() {
      this.searchQuery = ''
      this.selectedCategory = null
      this.selectedBrand = null
    },
    async AddGameDetail() {
      if (this.gameObj && Object.keys(this.gameObj).length > 0) {
        try {
          let result = await api.post(`Game/insertGame`, this.gameObj);
          alert('Game Added');
          await this.getGameData();
          this.closeGameDialog();
        } catch (error) {
          console.error('Error adding game:', error);
          alert('Failed to save the game. Please try again.');
        }
      } else {
        alert('No input found!');
      }
    },
    async getGameData() {
      let gameData = await api.get(`Game/getAllGames`)

      this.GameList = gameData.data
    },
    async updateGame() {
      if (!this.currentGameId) {
        await Swal.fire('Error', 'Unable to update: game ID is missing.', 'error');
        return;
      }

      if (this.gameObj && Object.keys(this.gameObj).length > 0) {
        try {
          let result = await api.put(`Game/updateGame/${this.currentGameId}`, this.gameObj);
          await Swal.fire('Success', 'Game updated successfully', 'success');
          await this.getGameData();
          this.closeGameDialog();
        } catch (error) {
          console.error('Error updating game:', error);
          await Swal.fire('Error', 'Failed to update the game. Please try again.', 'error');
        }
      } else {
        await Swal.fire('Warning', 'No input found!', 'warning');
      }
    },
    async deleteGame(gameId) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        try {
          await api.delete(`Game/deleteGame/${gameId}`);
          await Swal.fire('Deleted!', 'Game has been deleted.', 'success');
          await this.getGameData();
        } catch (error) {
          console.error('Error deleting game:', error);
          await Swal.fire('Error', 'Failed to delete the game. Please try again.', 'error');
        }
      }
    }

  },

}
</script>

<style lang="scss">
@import '../../style/inventorysystem.css'
</style>